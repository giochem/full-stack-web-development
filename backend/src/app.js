const express = require("express");
const sessions = require("express-session");

const cors = require("cors");
const app = express();
app.use(
  sessions({
    secret: "session secret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
    resave: true,
    saveUninitialized: false,
  })
);
app.use(express.json());
app.use(cors());

//router
app.use("/api", require("./routes/index.router"));

module.exports = app;
