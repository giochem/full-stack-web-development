import { body, param, query } from "express-validator";

const cartValidation = {
  getCarts: [
    query("offset").optional().isInt().toInt(),
    query("page")
      .isInt({ min: 0 })
      .withMessage("page in query is required and >= 0"),
    query("size")
      .isInt({ min: 1 })
      .withMessage("size in query is required and >= 1"),
    query("searchText")
      .optional()
      .isString()
      .withMessage("searchText in query must be a string")
  ],

  getCart: [
    param("userID").isInt().toInt()
  ],

  upsertCart: [
    body("userID").optional().isInt().withMessage("userID must be an integer"),
    body("productItemID")
      .optional()
      .isInt()
      .withMessage("productItemID must be an integer"),
    body("quantity")
      .isInt({ min: 0 })
      .withMessage("Quantity must be at least 0")
  ]
};

export default cartValidation;
