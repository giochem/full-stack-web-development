import { body, param } from "express-validator";

export const validateUpsertVariation = [
  body("name").notEmpty().withMessage("Variation name is required")
];

export const validateDeleteVariation = [
  param("variationID").isInt().withMessage("Variation ID must be an integer")
];
