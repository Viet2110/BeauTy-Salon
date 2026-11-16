const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET /api/feedbacks?salonId=1  - danh sách đánh giá
router.get('/', async (req, res) => {
  const { salonId } = req.query;
  const [rows] = await db.query(
    `SELECT f.id, f.salon_id, f.rating, f.comment, f.created_at, u.name AS user_name
     FROM feedbacks f JOIN users u ON u.id = f.user_id
     ${salonId ? 'WHERE f.salon_id = ?' : ''} ORDER BY f.created_at DESC`,
    salonId ? [salonId] : []
  );
  res.json(rows);
});

// POST /api/feedbacks  - gửi đánh giá 1-5 sao + nhận xét
router.post('/', auth, async (req, res) => {
  const { salonId, appointmentId, rating, comment } = req.body;
  const stars = Number(rating);
  if (!salonId) return res.status(400).json({ message: 'Thiếu salon' });
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) return res.status(400).json({ message: 'Số sao phải từ 1 đến 5' });
  if (appointmentId) {
    const [a] = await db.query('SELECT id FROM appointments WHERE id = ? AND user_id = ?', [appointmentId, req.user.id]);
    if (!a[0]) return res.status(403).json({ message: 'Lịch hẹn không hợp lệ' });
  }
  const [r] = await db.query(
    'INSERT INTO feedbacks (user_id, salon_id, appointment_id, rating, comment) VALUES (?,?,?,?,?)',
    [req.user.id, salonId, appointmentId || null, stars, (comment || '').slice(0, 1000)]
  );
  res.status(201).json({ id: r.insertId });
});

module.exports = router;
