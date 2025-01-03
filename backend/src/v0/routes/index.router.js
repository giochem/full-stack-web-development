import express from "express";
import authRouter from "./auth.router.js";
import userRouter from "./users.router.js";
import productRouter from "./products.router.js";
import promotionRouter from "./promotions.router.js";
import categoryRouter from "./categories.router.js";
import cartRouter from "./carts.router.js";
import orderRouter from "./orders.router.js";
import variationRouter from "./variations.router.js";
const apiRoute = express();

apiRoute.get("", (req, res) => {
  res.json("Hi! this is backend");
});

apiRoute.use("/auth", authRouter);
apiRoute.use("/users", userRouter);
apiRoute.use("/products", productRouter);
apiRoute.use("/variations", variationRouter);
apiRoute.use("/promotions", promotionRouter);
apiRoute.use("/categories", categoryRouter);
apiRoute.use("/carts", cartRouter);
apiRoute.use("/orders", orderRouter);
export default apiRoute;
