const multer = require("multer");
const { randomUUID } = require("crypto");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${
        new Date().toISOString().split("T")[0]
      }_${randomUUID()}.${file.originalname.split(".").pop()}`
    );
  },
});
const upload = multer({ storage });

module.exports = { upload };
