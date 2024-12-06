const express = require("express");
const router = express.Router();

const { authorizeRoles } = require("../middlewares/authen.middleware");

const userController = require("../controllers/users.controller");

const { validate } = require("../middlewares/validate.middleware");
const userValidation = require("../validations/users.validation");

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

module.exports = router;
