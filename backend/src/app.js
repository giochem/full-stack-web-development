import express from "express";
import sessions from "express-session";
import cookieParser from "cookie-parser";
import Response from "./v0/configs/response.js";
import { Path } from "./v0/utils/constants.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import router from "./v0/routes/index.router.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  sessions({
    secret: "session secret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    },
    resave: false,
    saveUninitialized: true
  })
);

// Fix the static file serving path for the uploads folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads/v0", express.static(path.join(__dirname, "./v0/uploads")));

app.use("/api", router);

app.use((err, req, res, next) => {
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message;
  return Response.serverError(res, message, err);
});

export default app;
