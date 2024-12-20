import multer from "multer";
import { randomUUID } from "crypto";
import { Path } from "../utils/constants.js";
import Response from "./response.js";

// Define allowed image types
const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp"
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, Path.UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, `${randomUUID()}.${ALLOWED_TYPES[file.mimetype]}`);
  }
});

// File filter to check file type
const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});
