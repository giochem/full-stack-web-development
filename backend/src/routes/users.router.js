const express = require("express");
const router = express.Router();

const { authorizeRoles } = require("../middlewares/authen.middleware");

const userController = require("../controllers/users.controller");

const userValidation = require("../validations/users.validation");

// mangement users: createUser, getUsers, getUser, updateUser, deleteUser
router.post("/", userController.createUser);
router.get("/", userValidation.getUsers, userController.getUsers);
router.get(
  "/:userID",
  authorizeRoles("admin", "client"),
  userController.getUser
);
router.put(
  "/:userID",
  authorizeRoles("admin", "client"),
  userController.updateUser
);
router.delete(
  "/:userID",
  authorizeRoles("admin", "client"),
  userController.deleteUser
);

module.exports = router;
