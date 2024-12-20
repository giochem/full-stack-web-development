import express from 'express';
import { validate } from "../middlewares/validate.middleware.js";
import authValidation from "../validations/auth.validation.js";
import * as authController from "../controllers/auth.controller.js";
import { authorizeRoles } from "../middlewares/authen.middleware.js";

const router = express.Router();

router.get(
  "/profile",
  authorizeRoles("client", "admin"),
  authController.getProfile
);
router.post(
  "/register",
  authValidation.register,
  validate,
  authController.register
);
router.post("/login", authValidation.login, validate, authController.login);
router.post("/logout", authController.logout);

export default router;
