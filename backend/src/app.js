const express = require("express");
const sessions = require("express-session");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  sessions({
    secret: "session secret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
    resave: false,
    saveUninitialized: true,
  })
);

//router
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/api", require("./routes/index.router"));

module.exports = app;

