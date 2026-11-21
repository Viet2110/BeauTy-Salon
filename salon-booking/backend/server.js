require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const origins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());
app.use(cors({ origin: origins }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Gói handler async để lỗi được chuyển vào error middleware (Express 4)
const wrap = (router) => {
  router.stack.forEach((layer) => {
    if (!layer.route) return;
    layer.route.stack.forEach((l) => {
      const fn = l.handle;
      if (fn.length <= 3)
        l.handle = (req, res, next) =>
          Promise.resolve(fn(req, res, next)).catch(next);
    });
  });
  return router;
};

app.use("/api/auth", wrap(require("./src/routes/auth")));
app.use("/api", wrap(require("./src/routes/catalog")));
app.use("/api/appointments", wrap(require("./src/routes/appointments")));
app.use(
  "/api/admin/appointments",
  wrap(require("./src/routes/adminAppointments")),
);
app.use("/api/feedbacks", wrap(require("./src/routes/feedback")));

app.use((req, res) =>
  res.status(404).json({ message: "Endpoint không tồn tại" }),
);
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Lỗi máy chủ" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API chạy tại http://localhost:${port}`));
