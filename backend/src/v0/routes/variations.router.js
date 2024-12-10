const express = require("express");
const router = express.Router();
const { authorizeRoles } = require("../middlewares/authen.middleware");
const { validate } = require("../middlewares/validate.middleware");
const variationValidation = require("../validations/variations.validation");
const variationController = require("../controllers/variations.controller");

router.get("/", variationController.getVariations);

router.put(
  "/",
  authorizeRoles("admin"),
  variationValidation.upsertVariation,
  validate,
  variationController.upsertVariation
);

router.delete(
  "/:variationID",
  authorizeRoles("admin"),
  variationValidation.deleteVariation,
  validate,
  variationController.deleteVariation
);

module.exports = router;
