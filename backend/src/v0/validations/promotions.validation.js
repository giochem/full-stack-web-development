const { body, query, param } = require("express-validator");

module.exports = {
  getPromotions: [
    query("page")
      .isInt({ min: 0 })
      .withMessage("page in query is required and >= 0"),
    query("size")
      .isInt({ min: 1 })
      .withMessage("size in query is required and >= 1"),
  ],

  getPromotion: [
    param("promotionID")
      .notEmpty()
      .withMessage("promotionID is required")
      .isInt()
      .withMessage("promotionID must be an integer"),
  ],

  createPromotion: [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
    body("reduce")
      .notEmpty()
      .withMessage("Reduce percentage is required")
      .isFloat({ min: 0, max: 100 })
      .withMessage("Reduce must be between 0 and 100"),
    body("startTime")
      .notEmpty()
      .withMessage("Start time is required")
      .isISO8601()
      .withMessage("Start time must be a valid date"),
    body("endTime")
      .notEmpty()
      .withMessage("End time is required")
      .isISO8601()
      .withMessage("End time must be a valid date"),
    body("productIDs")
      .optional()
      .isString()
      .withMessage("ProductIDs must be a string")
      .matches(/^(\d+,)*\d+$/)
      .withMessage("ProductIDs must be comma-separated numbers (e.g., '1,2,3')"),
  ],

  updatePromotion: [
    param("promotionID")
      .notEmpty()
      .withMessage("promotionID is required")
      .isInt()
      .withMessage("promotionID must be an integer"),
    body("name")
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
    body("reduce")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Reduce must be between 0 and 100"),
    body("startTime")
      .optional()
      .isISO8601()
      .withMessage("Start time must be a valid date"),
    body("endTime")
      .optional()
      .isISO8601()
      .withMessage("End time must be a valid date"),
    body("productIDs")
      .optional()
      .isString()
      .withMessage("ProductIDs must be a string")
      .matches(/^(\d+,)*\d+$/)
      .withMessage("ProductIDs must be comma-separated numbers (e.g., '1,2,3')"),
  ],

  deletePromotion: [
    param("promotionID")
      .notEmpty()
      .withMessage("promotionID is required")
      .isInt()
      .withMessage("promotionID must be an integer"),
  ],
}; 