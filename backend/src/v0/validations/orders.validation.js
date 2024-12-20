import { body, param, query } from "express-validator";

export const validateGetOrders = [
  query("page")
    .isInt({ min: 0 })
    .withMessage("page in query is required and >= 0"),
  query("size")
    .isInt({ min: 1 })
    .withMessage("size in query is required and >= 1"),
  query("offset").optional().isInt().toInt()
];

export const validateGetOrderItem = [
  param("orderID")
    .notEmpty()
    .withMessage("orderID is required")
    .isInt()
    .withMessage("orderID must be an integer")
];

export const validateCreateOrder = [
  body("fullName")
    .notEmpty()
    .withMessage("fullName is required")
    .isString()
    .withMessage("fullName must be a string"),
  body("phone")
    .notEmpty()
    .withMessage("phone is required")
    .matches(/^[0-9]+$/)
    .withMessage("phone must be a valid number"),
  body("address")
    .notEmpty()
    .withMessage("address is required")
    .isString()
    .withMessage("address must be a string"),
  body("note").optional().isString().withMessage("note must be a string")
];

export const validateUpdateOrder = [
  param("orderID").isInt().toInt(),
  body("status")
    .optional()
    .isIn(["processing", "completed", "cancelled"])
    .withMessage("Invalid status value")
];

export const validateDeleteOrder = [
  param("orderID")
    .notEmpty()
    .withMessage("orderID is required")
    .isInt()
    .withMessage("orderID must be an integer")
];
