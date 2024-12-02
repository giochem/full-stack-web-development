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
    body("userID")
      .notEmpty()
      .withMessage("userID is required")
      .isInt()
      .withMessage("userID must be an integer"),
    body("status")
      .optional()
      .isIn(["processing", "completed", "cancelled"])
      .withMessage("Invalid status value"),
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
