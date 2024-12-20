import { body } from "express-validator";

export const validateRegister = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Username must be between 1 and 50 characters"),
  body("email").notEmpty().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required")
];

export const validateLogin = [
  body("email").notEmpty().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required")
];
