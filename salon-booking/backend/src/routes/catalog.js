// Salon, Service, Beautician, Consultant (dữ liệu danh mục - công khai)
const router = require('express').Router();
const db = require('../db');

// ===== Salon =====
// GET /api/salons  - danh sách salon (kèm điểm đánh giá trung bình)
router.get('/salons', async (_req, res) => {
  const [rows] = await db.query(`
    SELECT s.*, ROUND(AVG(f.rating),1) AS avg_rating, COUNT(f.id) AS review_count
    FROM salons s LEFT JOIN feedbacks f ON f.salon_id = s.id
    GROUP BY s.id ORDER BY s.id`);
  res.json(rows);
});

// GET /api/salons/:id  - thông tin salon
router.get('/salons/:id', async (req, res) => {
  const [rows] = await db.query(
    `SELECT s.*, ROUND(AVG(f.rating),1) AS avg_rating, COUNT(f.id) AS review_count
     FROM salons s LEFT JOIN feedbacks f ON f.salon_id = s.id WHERE s.id = ? GROUP BY s.id`,
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ message: 'Không tìm thấy salon' });
  res.json(rows[0]);
});

// ===== Service =====
// GET /api/salons/:id/services
router.get('/salons/:id/services', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM services WHERE salon_id = ? ORDER BY price', [req.params.id]);
  res.json(rows);
});

// GET /api/services/:id
router.get('/services/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM services WHERE id = ?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
  res.json(rows[0]);
});

// POST /api/services/total  - tính tổng tiền & thời lượng cho nhiều dịch vụ
router.post('/services/total', async (req, res) => {
  const ids = Array.isArray(req.body.serviceIds) ? req.body.serviceIds.map(Number).filter(Boolean) : [];
  if (!ids.length) return res.json({ total: 0, duration: 0, count: 0 });
  const [rows] = await db.query('SELECT price, duration_min FROM services WHERE id IN (?)', [ids]);
  res.json({
    total: rows.reduce((s, r) => s + Number(r.price), 0),
    duration: rows.reduce((s, r) => s + r.duration_min, 0),
    count: rows.length,
  });
});

// ===== Beautician =====
// GET /api/salons/:id/beauticians
router.get('/salons/:id/beauticians', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM beauticians WHERE salon_id = ?', [req.params.id]);
  res.json(rows);
});

// ===== Consultant =====
// GET /api/consultants?salonId=1  (kèm tư vấn viên chung salon_id = NULL)
router.get('/consultants', async (req, res) => {
  const { salonId } = req.query;
  const [rows] = salonId
    ? await db.query('SELECT * FROM consultants WHERE salon_id = ? OR salon_id IS NULL', [salonId])
    : await db.query('SELECT * FROM consultants');
  res.json(rows);
});

module.exports = router;
