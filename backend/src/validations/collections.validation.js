const { body, query, param } = require("express-validator");

module.exports = {
  // Get list with pagination
  getCollections: [
    query("page")
      .isInt({ min: 0 })
      .withMessage("page in query is required and >= 0"),
    query("size")
      .isInt({ min: 1 })
      .withMessage("size in query is required and >= 1"),
  ],

  // Get single item
  getCollection: [
    param("collectionID")
      .notEmpty()
      .withMessage("collectionID is required")
      .isInt()
      .withMessage("collectionID must be an integer"),
  ],

  // Create
  createCollection: [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
  ],

  // Update
  updateCollection: [
    param("collectionID")
      .notEmpty()
      .withMessage("collectionID is required")
      .isInt()
      .withMessage("collectionID must be an integer"),
    body("name")
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
    body("productIDs")
      .optional()
      .isString()
      .withMessage("ProductIDs must be a string")
      .matches(/^(\d+,)*\d+$/)
      .withMessage(
        "ProductIDs must be comma-separated numbers (e.g., '1,2,3')"
      ),
  ],

  // Delete
  deleteCollection: [
    param("collectionID")
      .notEmpty()
      .withMessage("collectionID is required")
      .isInt()
      .withMessage("collectionID must be an integer"),
  ],
};
