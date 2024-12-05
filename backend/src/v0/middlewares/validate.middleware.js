const { validationResult } = require("express-validator");
const Response = require("../configs/response");
module.exports = {
  validate: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return Response.error(res, "User data is invalid", errors.array());
    }
    return next();
  },
};
