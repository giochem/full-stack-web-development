const { body, query, param } = require("express-validator");

module.exports = {
  // Validate get users list with pagination
  getUsers: [
    query("page")
      .isInt({ min: 0 })
      .withMessage("page in query is required and >= 0"),
    query("size")
      .isInt({ min: 1 })
      .withMessage("size in query is required and >= 1"),
  ],

  // Validate get single user
  getUser: [
    param("userID")
      .notEmpty()
      .withMessage("userID is required")
      .isInt()
      .withMessage("userID must be an integer")
  ],

  // Validate create user
  createUser: [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3, max: 50 })
      .withMessage("Username must be between 3 and 50 characters"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      .withMessage("Password must contain at least one letter and one number"),
    body("role")
      .optional()
      .isIn(["admin", "client"])
      .withMessage("Role must be either admin or client"),
  ],

  // Validate update user
  updateUser: [
    param("userID")
      .notEmpty()
      .withMessage("userID is required")
      .isInt()
      .withMessage("userID must be an integer"),
    body("username")
      .optional()
      .isLength({ min: 3, max: 50 })
      .withMessage("Username must be between 3 and 50 characters"),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      .withMessage("Password must contain at least one letter and one number"),
    body("role")
      .optional()
      .isIn(["admin", "client"])
      .withMessage("Role must be either admin or client"),
  ],

  // Validate delete user
  deleteUser: [
    param("userID")
      .notEmpty()
      .withMessage("userID is required")
      .isInt()
      .withMessage("userID must be an integer")
  ],
};
