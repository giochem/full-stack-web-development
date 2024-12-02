const express = require("express");
const router = express.Router();

const { authorizeRoles } = require("../middlewares/authen.middleware");
const { validate } = require("../middlewares/validate.middleware");
const collectionValidation = require("../validations/collections.validation");
const collectionController = require("../controllers/collections.controller");

// Base CRUD routes with validation and authorization
router.post("/", 
  authorizeRoles("admin"),
  collectionValidation.createCollection,
  validate,
  collectionController.createCollection
);

router.get("/",
  collectionValidation.getCollections,
  validate,
  collectionController.getCollections
);

router.get("/:collectionID",
  collectionValidation.getCollection,
  validate,
  collectionController.getCollection
);

router.put("/:collectionID",
  authorizeRoles("admin"),
  collectionValidation.updateCollection,
  validate,
  collectionController.updateCollection
);

router.delete("/:collectionID",
  authorizeRoles("admin"),
  collectionValidation.deleteCollection,
  validate,
  collectionController.deleteCollection
);

module.exports = router;
