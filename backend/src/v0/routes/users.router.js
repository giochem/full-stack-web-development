import express from "express";
import { authorizeRoles } from "../middlewares/authen.middleware.js";
import {
  handleGetUsers,
  handleGetUser,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser
} from "../controllers/users.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  validateGetUsers,
  validateGetUser,
  validateCreateUser,
  validateUpdateUser,
  validateDeleteUser,
  validateSearchUsers
} from "../validations/users.validation.js";

const router = express.Router();

router.get(
  "/",
  authorizeRoles("admin"),
  validateGetUsers,
  validate,
  handleGetUsers
);

router.get(
  "/:userID",
  authorizeRoles("admin", "client"),
  validateGetUser,
  validate,
  handleGetUser
);
router.post(
  "/",
  authorizeRoles("admin"),
  validateCreateUser,
  validate,
  handleCreateUser
);
router.put(
  "/:userID",
  authorizeRoles("admin"),
  validateUpdateUser,
  validate,
  handleUpdateUser
);
router.delete(
  "/:userID",
  authorizeRoles("admin"),
  validateDeleteUser,
  validate,
  handleDeleteUser
);

export default router;
