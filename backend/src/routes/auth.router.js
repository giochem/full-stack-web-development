const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();

router.get("/check", authController.check);
router.get("/login", authController.login);
router.post("/register", authController.register);

module.exports = router;
