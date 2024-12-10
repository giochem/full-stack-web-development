const express = require("express");
const router = express.Router();
const { authorizeRoles } = require("../middlewares/authen.middleware");
const { validate } = require("../middlewares/validate.middleware");
const paymentValidation = require("../validations/payments.validation");
const paymentController = require("../controllers/payments.controller");

router.get("/", paymentController.getPayments);

router.put(
  "/",
  authorizeRoles("admin"),
  paymentValidation.upsertPayment,
  validate,
  paymentController.upsertPayment
);

router.delete(
  "/:paymentID",
  authorizeRoles("admin"),
  paymentValidation.deletePayment,
  validate,
  paymentController.deletePayment
);

module.exports = router;
