import express from "express";
import { authorizeRoles } from "../middlewares/authen.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import promotionValidation from "../validations/promotions.validation.js";
import * as promotionController from "../controllers/promotions.controller.js";

const router = express.Router();

router.get("/", promotionController.getPromotions);

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

export default router;
