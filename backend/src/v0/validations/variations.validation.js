import { body, param } from "express-validator";

const variationValidation = {
    upsertVariation: [
        body("name").notEmpty().withMessage("Variation name is required")
    ],

    deleteVariation: [
        param("variationID").isInt().withMessage("Variation ID must be an integer")
    ]
};

export default variationValidation;
