const { body, query, param } = require("express-validator");

module.exports = {
  upsertVariation: [
    body("variationID")
      .optional()
      .isInt()
      .withMessage("variationID must be an integer"),
    body("nameAtribute").optional(),
    body("variationOptionID")
      .optional()
      .isInt()
      .withMessage("variationOptionID must be an integer"),
    body("value").optional(),
  ],

  deleteVariation: [
    query("variationID")
      .optional()
      .isInt()
      .withMessage("variationID must be an integer"),
    query("variationOptionID")
      .optional()
      .isInt()
      .withMessage("variationOptionID must be an integer"),
  ],
};
