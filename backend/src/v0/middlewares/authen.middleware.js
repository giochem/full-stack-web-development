module.exports = {
  authorizeRoles:
    (...roles) =>
    (req, res, next) => {
      if (!roles.includes(req.session.role || "none")) {
        return res
          .status(403)
          .json({ status: false, message: "Access denied" });
      }
      next();
    },
};
