import express from "express";
import { authorizeRoles } from "../middlewares/authen.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  validateUpsertPromotion,
  validateDeletePromotion
} from "../validations/promotions.validation.js";
import {
  handleGetPromotions,
  handleUpsertPromotion,
  handleDeletePromotion
} from "../controllers/promotions.controller.js";

const router = express.Router();

router.get("/", handleGetPromotions);

router.put(
  "/",
  authorizeRoles("admin"),
  validateUpsertPromotion,
  validate,
  handleUpsertPromotion
);

router.delete(
  "/:promotionID",
  authorizeRoles("admin"),
  validateDeletePromotion,
  validate,
  handleDeletePromotion
);

export default router;
