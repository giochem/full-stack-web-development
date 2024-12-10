const { body, query, param } = require("express-validator");

module.exports = {
  upsertPayment: [
    body("paymentID")
      .optional()
      .isInt()
      .withMessage("paymentID must be an integer"),
    body("name")
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
    body("price").notEmpty().isFloat().withMessage("Price is required"),
  ],

  deletePromotion: [
    param("promotionID")
      .notEmpty()
      .withMessage("promotionID is required")
      .isInt()
      .withMessage("promotionID must be an integer"),
  ],
};
