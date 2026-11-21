module.exports = function admin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Bạn không có quyền truy cập chức năng này",
    });
  }

  next();
};
