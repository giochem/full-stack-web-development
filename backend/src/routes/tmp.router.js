const express = require("express");

const router = express.Router();

// get array from req.body
router.get("/array", (req, res, next) => {
  console.log(req.body.name.length);
});

const { config } = require("../configs/db");
const sql = require("mssql");
router.get("/two-table", async (req, res, next) => {
  try {
    const data = await sql
      .connect(config)
      .then((conn) => {
        console.log("Connected to SQLServer...");
        console.log("procedure demo");
        return conn
          .request()
          .execute("demo")
          .catch((err) => {
            console.log("Database Execute Failed! Bad Config: ", err);
          });
      })
      .catch((err) => {
        console.log("Database Connection Failed! Bad Config: ", err);
      });

    console.log(data.recordsets);
    res.json({ success: true, data: data });
  } catch (error) {
    console.log(error);
  }
});
// demo upload file
const { upload } = require("../configs/storage");

router.post("/upload", upload.single("file"), (req, res, next) => {
  res.json({ message: true, data: req.file + "--" + req.body.new });
});
module.exports = router;
// var fs = require("fs");
// // var filePath = 'c:/book/discovery.docx';

// apiRoute.delete("/image/:filename", (req, res, next) => {
//   fs.unlinkSync(`./src/uploads/${req.params.filename}`);
//   res.json(`D:\\clothes-369\\backend\\src\\uploads\\${req.params.filename}`);
// });
