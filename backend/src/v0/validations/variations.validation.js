const { body, query, param } = require("express-validator");

module.exports = {
  upsertVariation: [
    body("variationID")
      .optional()
      .isInt()
      .withMessage("variationID must be an integer"),
    body("nameAtribute").optional(),
  ],

  deleteVariation: [
    param("variationID").isInt().withMessage("variationID must be an integer"),
  ],
};
