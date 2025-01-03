import express from "express";
import { authorizeRoles } from "../middlewares/authen.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  validateUpsertVariation,
  validateDeleteVariation
} from "../validations/variations.validation.js";
import {
  handleGetVariations,
  handleUpsertVariation,
  handleDeleteVariation
} from "../controllers/variations.controller.js";

const router = express.Router();

router.get("/", handleGetVariations);

router.put(
  "/",
  authorizeRoles("admin"),
  validateUpsertVariation,
  validate,
  handleUpsertVariation
);

router.delete(
  "/:variationID",
  authorizeRoles("admin"),
  validateDeleteVariation,
  validate,
  handleDeleteVariation
);

export default router;
