const express = require("express");
const authRouter = require("./auth.router");
const userRouter = require("./users.router");
const productRouter = require("./products.router");
const promotionRouter = require("./promotions.router");
const categoryRouter = require("./categories.router");
const cartRouter = require("./carts.router");
const orderRouter = require("./orders.router");
const variationRouter = require("./variations.router");
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
module.exports = apiRoute;
