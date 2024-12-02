const express = require("express");
const router = express.Router();
const { authorizeRoles } = require("../middlewares/authen.middleware");
const { validate } = require("../middlewares/validate.middleware");
const promotionValidation = require("../validations/promotions.validation");
const promotionController = require("../controllers/promotions.controller");

router.post("/",
  authorizeRoles("admin"),
  promotionValidation.createPromotion,
  validate,
  promotionController.createPromotion
);

router.get("/",
  promotionValidation.getPromotions,
  validate,
  promotionController.getPromotions
);

router.get("/:promotionID",
  promotionValidation.getPromotion,
  validate,
  promotionController.getPromotion
);

router.put("/:promotionID",
  authorizeRoles("admin"),
  promotionValidation.updatePromotion,
  validate,
  promotionController.updatePromotion
);

router.delete("/:promotionID",
  authorizeRoles("admin"),
  promotionValidation.deletePromotion,
  validate,
  promotionController.deletePromotion
);

module.exports = router;
