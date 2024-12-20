import express from "express";
import { authorizeRoles } from "../middlewares/authen.middleware.js";
import * as userController from "../controllers/users.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import userValidation from "../validations/users.validation.js";

const router = express.Router();

router.get(
  "/",
  authorizeRoles("admin"),
  userValidation.getUsers,
  validate,
  userController.getUsers
);

router.get(
  "/:userID",
  authorizeRoles("admin", "client"),
  userValidation.getUser,
  validate,
  userController.getUser
);
router.post(
  "/",
  authorizeRoles("admin"),
  userValidation.createUser,
  validate,
  userController.createUser
);
router.put(
  "/:userID",
  authorizeRoles("admin"),
  userValidation.updateUser,
  validate,
  userController.updateUser
);

export default router;
