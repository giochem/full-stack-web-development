const { body, query, param } = require("express-validator");

module.exports = {
  getUsers: [
    query("page")
      .isInt({ min: 0 })
      .withMessage("page in query is required and >= 0"),
    query("size")
      .isInt({ min: 1 })
      .withMessage("size in query is required and >= 1"),
  ],
  getUser: [param("userID").isInt().withMessage("userID in params not found")],
  createUser: [],
  updateUser: [],
  deleteUser: [],
};
