const express = require("express");
const router = express.Router();
const { authorizeRoles } = require("../middlewares/authen.middleware");
const { validate } = require("../middlewares/validate.middleware");
const promotionValidation = require("../validations/promotions.validation");
const promotionController = require("../controllers/promotions.controller");

router.get(
  "/",
  promotionController.getPromotions
);

router.put(
  "/",
  authorizeRoles("admin"),
  promotionValidation.upsertPromotion,
  validate,
  promotionController.upsertPromotion
);

router.delete(
  "/:promotionID",
  authorizeRoles("admin"),
  promotionValidation.deletePromotion,
  validate,
  promotionController.deletePromotion
);

module.exports = router;
