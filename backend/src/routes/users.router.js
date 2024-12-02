const express = require("express");
const router = express.Router();

const { authorizeRoles } = require("../middlewares/authen.middleware");

const userController = require("../controllers/users.controller");

const { validate } = require("../middlewares/validate.middleware");
const userValidation = require("../validations/users.validation");

// mangement users: createUser, getUsers, getUser, updateUser, deleteUser
router.post(
  "/",
  authorizeRoles("admin"),
  userValidation.createUser,
  validate,
  userController.createUser
);
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
router.put(
  "/:userID",
  authorizeRoles("admin", "client"),
  userValidation.updateUser,
  validate,
  userController.updateUser
);
router.delete(
  "/:userID",
  authorizeRoles("admin", "client"),
  userValidation.deleteUser,
  validate,
  userController.deleteUser
);

module.exports = router;
