import { body, param } from "express-validator";

const promotionValidation = {
    upsertPromotion: [
        body("name").notEmpty().withMessage("Promotion name is required"),
        body("description").optional(),
        body("discountRate").isFloat({ min: 0, max: 100 }).withMessage("Discount rate must be between 0 and 100"),
        body("startDate").isISO8601().withMessage("Invalid start date format"),
        body("endDate").isISO8601().withMessage("Invalid end date format")
    ],

    deletePromotion: [
        param("promotionID").isInt().withMessage("Promotion ID must be an integer")
    ]
};

export default promotionValidation;
