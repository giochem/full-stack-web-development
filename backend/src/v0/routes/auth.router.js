import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import {
  validateRegister,
  validateLogin
} from "../validations/auth.validation.js";
import {
  handleGetProfile,
  handleRegister,
  handleLogin,
  handleLogout
} from "../controllers/auth.controller.js";
import { authorizeRoles } from "../middlewares/authen.middleware.js";

const router = express.Router();

router.get("/profile", authorizeRoles("client", "admin"), handleGetProfile);
router.post("/register", validateRegister, validate, handleRegister);
router.post("/login", validateLogin, validate, handleLogin);
router.post("/logout", handleLogout);

export default router;
