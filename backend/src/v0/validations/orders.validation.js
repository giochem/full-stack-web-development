const { body, query, param } = require("express-validator");

module.exports = {
  getOrders: [
    query("page")
      .isInt({ min: 0 })
      .withMessage("page in query is required and >= 0"),
    query("size")
      .isInt({ min: 1 })
      .withMessage("size in query is required and >= 1"),
  ],

  getOrderItem: [
    param("orderID")
      .notEmpty()
      .withMessage("orderID is required")
      .isInt()
      .withMessage("orderID must be an integer"),
  ],

  createOrder: [
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
    body("note").optional().isString().withMessage("note must be a string"),
  ],

  updateOrder: [
    param("orderID")
      .notEmpty()
      .withMessage("orderID is required")
      .isInt()
      .withMessage("orderID must be an integer"),
    body("status")
      .optional()
      .isIn(["processing", "completed", "cancelled"])
      .withMessage("Invalid status value"),
  ],

  deleteOrder: [
    param("orderID")
      .notEmpty()
      .withMessage("orderID is required")
      .isInt()
      .withMessage("orderID must be an integer"),
  ],
};
