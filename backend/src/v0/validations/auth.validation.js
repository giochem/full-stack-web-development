const { body } = require("express-validator");

module.exports = {
  register: [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 1, max: 50 })
      .withMessage("Username must be between 1 and 50 characters"),
    body("email").notEmpty().withMessage("Email is required"),
    // .isEmail()
    // .withMessage("Invalid email format")
    // .normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      .withMessage("Password must contain at least one letter and one number"),
  ],

  login: [
    body("email").notEmpty().withMessage("Email is required"),
    // .isEmail()
    // .withMessage("Invalid email format")
    // .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
};
