import { validationResult } from "express-validator";
import Response from "../configs/response.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Response.error(res, "Validation Error", errors.array());
  }
  next();
};
