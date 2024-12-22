import { body, param } from "express-validator";

export const validateUpsertPromotion = [
  body("name").notEmpty().withMessage("Promotion name is required"),
  body("description").optional(),
  body("discount")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount rate must be between 0 and 100"),
  body("startDate").isISO8601().withMessage("Invalid start date format"),
  body("endDate").isISO8601().withMessage("Invalid end date format")
];

export const validateDeletePromotion = [
  param("promotionID").isInt().withMessage("Promotion ID must be an integer")
];
