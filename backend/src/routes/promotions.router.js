const express = require("express");
const router = express.Router();
const { authorizeRoles } = require("../middlewares/authen.middleware");
const promotionController = require("../controllers/promotions.controller");

router.post("/", authorizeRoles("admin"), promotionController.createPromotion);
router.get("/", promotionController.getPromotions);
router.get("/:promotionID", promotionController.getPromotion);

router.put(
  "/:promotionID",
  authorizeRoles("admin"),
  promotionController.updatePromotion
);
router.delete(
  "/:promotionID",
  authorizeRoles("admin"),
  promotionController.deletePromotion
);

module.exports = router;
