import Response from "../configs/response.js";

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.session.role || "none")) {
      return res.status(403).json({ status: false, message: "Access denied" });
    }
    next();
  };
};
