// Booking + Appointment
const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

const toMin = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

// GET /api/appointments/slots?salonId=&date=YYYY-MM-DD&beauticianId=  - các khung giờ đã bận
router.get('/slots', async (req, res) => {
  const { salonId, date, beauticianId } = req.query;
  if (!salonId || !date) return res.status(400).json({ message: 'Thiếu salonId hoặc date' });
  const params = [salonId, date];
  let sql = `SELECT appointment_time, total_duration FROM appointments
             WHERE salon_id = ? AND appointment_date = ? AND status IN ('pending','confirmed')`;
  if (beauticianId) { sql += ' AND beautician_id = ?'; params.push(beauticianId); }
  const [rows] = await db.query(sql, params);
  res.json(rows.map((r) => ({ start: r.appointment_time.slice(0, 5), duration: r.total_duration })));
});

// POST /api/appointments  - xác nhận đặt lịch
router.post('/', auth, async (req, res) => {
  const { salonId, beauticianId, serviceIds, customerName, customerPhone, customerEmail, date, time, note } = req.body;
  if (!salonId || !Array.isArray(serviceIds) || !serviceIds.length)
    return res.status(400).json({ message: 'Vui lòng chọn salon và ít nhất một dịch vụ' });
  if (!customerName || !customerPhone) return res.status(400).json({ message: 'Vui lòng nhập tên và số điện thoại' });
  if (!date || !time) return res.status(400).json({ message: 'Vui lòng chọn ngày giờ' });

  const start = new Date(`${date}T${time}:00`);
  if (isNaN(start) || start < new Date()) return res.status(400).json({ message: 'Thời gian đặt lịch không hợp lệ' });

  const conn = await db.getConnection();
  try {
    const [[salon]] = await conn.query('SELECT * FROM salons WHERE id = ?', [salonId]);
    if (!salon) return res.status(404).json({ message: 'Không tìm thấy salon' });

    // Giá lấy từ DB, không tin giá từ client
    const [services] = await conn.query('SELECT * FROM services WHERE id IN (?) AND salon_id = ?', [serviceIds, salonId]);
    if (services.length !== new Set(serviceIds.map(Number)).size)
      return res.status(400).json({ message: 'Có dịch vụ không thuộc salon đã chọn' });
    const total = services.reduce((s, x) => s + Number(x.price), 0);
    const duration = services.reduce((s, x) => s + x.duration_min, 0);

    const s = toMin(time), e = s + duration;
    if (s < toMin(salon.open_time) || e > toMin(salon.close_time))
      return res.status(400).json({ message: `Salon làm việc ${salon.open_time.slice(0, 5)} - ${salon.close_time.slice(0, 5)}` });

    await conn.beginTransaction();
    if (beauticianId) {
      // Khóa các lịch cùng nhân viên cùng ngày để tránh đặt trùng
      const [busy] = await conn.query(
        `SELECT appointment_time, total_duration FROM appointments
         WHERE beautician_id = ? AND appointment_date = ? AND status IN ('pending','confirmed') FOR UPDATE`,
        [beauticianId, date]
      );
      const clash = busy.some((b) => s < toMin(b.appointment_time) + b.total_duration && toMin(b.appointment_time) < e);
      if (clash) {
        await conn.rollback();
        return res.status(409).json({ message: 'Nhân viên đã có lịch trong khung giờ này, vui lòng chọn giờ khác' });
      }
    }
    const [r] = await conn.query(
      `INSERT INTO appointments (user_id, salon_id, beautician_id, customer_name, customer_phone, customer_email,
        appointment_date, appointment_time, total_price, total_duration, note)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [req.user.id, salonId, beauticianId || null, customerName, customerPhone, customerEmail || null,
       date, time, total, duration, note || null]
    );
    for (const sv of services)
      await conn.query('INSERT INTO appointment_services (appointment_id, service_id, price) VALUES (?,?,?)', [r.insertId, sv.id, sv.price]);
    await conn.commit();
    res.status(201).json({ id: r.insertId, total_price: total, status: 'pending' });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

// GET /api/appointments  - danh sách lịch hẹn của tôi
router.get('/', auth, async (req, res) => {
  const [rows] = await db.query(
    `SELECT a.*, s.name AS salon_name, b.name AS beautician_name
     FROM appointments a JOIN salons s ON s.id = a.salon_id
     LEFT JOIN beauticians b ON b.id = a.beautician_id
     WHERE a.user_id = ? ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
    [req.user.id]
  );
  res.json(rows);
});

// GET /api/appointments/:id  - chi tiết
router.get('/:id', auth, async (req, res) => {
  const [rows] = await db.query(
    `SELECT a.*, s.name AS salon_name, s.address AS salon_address, b.name AS beautician_name
     FROM appointments a JOIN salons s ON s.id = a.salon_id
     LEFT JOIN beauticians b ON b.id = a.beautician_id
     WHERE a.id = ? AND a.user_id = ?`,
    [req.params.id, req.user.id]
  );
  if (!rows[0]) return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
  const [services] = await db.query(
    `SELECT sv.id, sv.name, aps.price, sv.duration_min FROM appointment_services aps
     JOIN services sv ON sv.id = aps.service_id WHERE aps.appointment_id = ?`,
    [req.params.id]
  );
  res.json({ ...rows[0], services });
});

// PATCH /api/appointments/:id/cancel  - hủy lịch
router.patch('/:id/cancel', auth, async (req, res) => {
  const [rows] = await db.query('SELECT status FROM appointments WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  if (!rows[0]) return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
  if (!['pending', 'confirmed'].includes(rows[0].status))
    return res.status(400).json({ message: 'Chỉ có thể hủy lịch đang chờ hoặc đã xác nhận' });
  await db.query("UPDATE appointments SET status = 'cancelled' WHERE id = ?", [req.params.id]);
  res.json({ id: Number(req.params.id), status: 'cancelled' });
});

module.exports = router;
