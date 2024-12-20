import express from "express";
import { authorizeRoles } from "../middlewares/authen.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import variationValidation from "../validations/variations.validation.js";
import * as variationController from "../controllers/variations.controller.js";

const router = express.Router();

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

export default router;
