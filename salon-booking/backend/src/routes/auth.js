const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const auth = require("../middleware/auth");

const sign = (u) =>
  jwt.sign(
    {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password)
    return res
      .status(400)
      .json({ message: "Thiếu họ tên, email hoặc mật khẩu" });

  if (password.length < 6)
    return res.status(400).json({ message: "Mật khẩu tối thiểu 6 ký tự" });

  const [exist] = await db.query("SELECT id FROM users WHERE email = ?", [
    email,
  ]);

  if (exist.length)
    return res.status(409).json({ message: "Email đã được đăng ký" });

  const hash = await bcrypt.hash(password, 10);

  const [r] = await db.query(
    "INSERT INTO users (name, email, phone, password_hash) VALUES (?,?,?,?)",
    [name, email, phone || null, hash],
  );

  const user = {
    id: r.insertId,
    name,
    email,
    phone: phone || null,
    role: "user",
  };

  res.status(201).json({
    token: sign(user),
    user,
  });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });

  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

  const u = rows[0];

  if (!u || !(await bcrypt.compare(password, u.password_hash)))
    return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });

  const user = {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
  };

  res.json({
    token: sign(user),
    user,
  });
});

// GET /api/auth/me
router.get("/me", auth, async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, name, email, phone, role FROM users WHERE id = ?",
    [req.user.id],
  );

  if (!rows[0])
    return res.status(404).json({ message: "Không tìm thấy người dùng" });

  res.json(rows[0]);
});

module.exports = router;
