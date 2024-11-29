const express = require("express");
const router = express.Router();
const { authorizeRoles } = require("../middlewares/authen.middleware");
const collectionController = require("../controllers/collections.controller");

router.post(
  "/",
  authorizeRoles("admin"),
  collectionController.createCollection
);
router.get("/", collectionController.getCollections);
router.get("/:collectionID", collectionController.getCollection);

router.put(
  "/:collectionID",
  authorizeRoles("admin"),
  collectionController.updateCollection
);
router.delete(
  "/:collectionID",
  authorizeRoles("admin"),
  collectionController.deleteCollection
);

module.exports = router;
