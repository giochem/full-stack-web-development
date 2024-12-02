const express = require("express");
const { check, oneOf, validationResult } = require("express-validator");

const router = express.Router();

// get array from req.body
router.get("/check",[
  check('username').exists(),
  check('password').exists()
], (req, res, next) => {
  console.log(req.body.name.length);
});

module.exports = router;
