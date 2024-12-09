const { body, query, param } = require("express-validator");

module.exports = {
  upsertPromotion: [
    body("promotionID")
      .optional()
      .isInt()
      .withMessage("promotionID must be an integer"),
    body("name")
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
    body("discount")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Reduce must be between 0 and 100"),
    body("startTime")
      .optional()
      .isISO8601()
      .withMessage("Start time must be a valid date"),
    body("endDate")
      .optional()
      .isISO8601()
      .withMessage("End time must be a valid date"),
  ],

  deletePromotion: [
    param("promotionID")
      .notEmpty()
      .withMessage("promotionID is required")
      .isInt()
      .withMessage("promotionID must be an integer"),
  ],
};
