const express = require("express");
const tmpRouter = require("./tmp.router");
const authRouter = require("./auth.router");
const userRouter = require("./users.router");
const productRouter = require("./products.router");
const collectionRouter = require("./collections.router");
const promotionRouter = require("./promotions.router");
const cartRouter = require("./carts.router");
const orderRouter = require("./orders.router");

const apiRoute = express();

apiRoute.get("", (req, res) => {
  res.json("Hi! this is backend");
});
apiRoute.use("/tmp", tmpRouter);
apiRoute.use("/auth", authRouter);
apiRoute.use("/users", userRouter);
apiRoute.use("/products", productRouter);
apiRoute.use("/collections", collectionRouter);
apiRoute.use("/promotions", promotionRouter);
apiRoute.use("/carts", cartRouter);
apiRoute.use("/orders", orderRouter);

module.exports = apiRoute;
