const router = require("express").Router();
const db = require("../db");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Tất cả API trong file này đều yêu cầu đăng nhập Admin
router.use(auth, admin);

// GET /api/admin/appointments
// Lấy toàn bộ lịch đặt

router.get("/", async (req, res) => {
  const [rows] = await db.query(`
    SELECT
      a.*,
      s.name AS salon_name,
      b.name AS beautician_name,
      (
        SELECT GROUP_CONCAT(sv.name SEPARATOR ', ')
        FROM appointment_services aps
        JOIN services sv ON sv.id = aps.service_id
        WHERE aps.appointment_id = a.id
      ) AS service_names
    FROM appointments a
    JOIN salons s ON s.id = a.salon_id
    LEFT JOIN beauticians b ON b.id = a.beautician_id
    ORDER BY a.created_at DESC
  `);

  res.json(rows);
});

// PATCH /api/admin/appointments/:id/status
// Cập nhật trạng thái lịch đặt
router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  const allowedStatus = ["pending", "confirmed", "completed", "cancelled"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({
      message: "Trạng thái không hợp lệ",
    });
  }

  const [result] = await db.query(
    "UPDATE appointments SET status = ? WHERE id = ?",
    [status, req.params.id],
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      message: "Không tìm thấy lịch hẹn",
    });
  }

  res.json({
    id: Number(req.params.id),
    status,
    message: "Cập nhật trạng thái thành công",
  });
});

// DELETE /api/admin/appointments/:id
// Xóa lịch đặt
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "ID lịch đặt không hợp lệ",
    });
  }

  const [result] = await db.query("DELETE FROM appointments WHERE id = ?", [
    id,
  ]);

  if (result.affectedRows === 0) {
    return res.status(404).json({
      message: "Không tìm thấy lịch đặt",
    });
  }

  res.json({
    message: "Xóa lịch đặt thành công",
  });
});

module.exports = router;
