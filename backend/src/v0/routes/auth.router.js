const express = require("express");
const router = express.Router();
const { validate } = require("../middlewares/validate.middleware");
const authValidation = require("../validations/auth.validation");
const authController = require("../controllers/auth.controller");
const { authorizeRoles } = require("../middlewares/authen.middleware");

router.post(
  "/register",
  authValidation.register,
  validate,
  authController.register
);
router.post("/login", authValidation.login, validate, authController.login);
router.get(
  "/profile",
  authorizeRoles("client", "admin"),
  authController.getProfile
);
//router.get("/logout", authController.logout);

module.exports = router;