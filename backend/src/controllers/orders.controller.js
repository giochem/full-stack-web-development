const orderService = require("../services/orders.service");
module.exports = {
  getOrders: async (req, res, next) => {
    try {
      const { page, size } = req.query;
      const offset = page * size;
      const data = await orderService.getOrdersByOffsetBased(offset, size);
      res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.log(error);
    }
  },
  getOrder: async (req, res, next) => {
    try {
      const { orderID } = req.params;
      const data = await orderService.getOrderByOrderID(orderID);
      res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
    }
  },
  createOrder: async (req, res, next) => {
    try {
      const userID = req.params.userID;
      await orderService.createOrder(userID);
      res.status(200).json({ success: true, message: "successfully create" });
    } catch (error) {
      console.log(error);
    }
  },
  updateOrder: async (req, res, next) => {
    try {
      const { status } = req.body;
      const orderID = req.params.orderID;

      await orderService.updateOrder({
        orderID,
        status,
      });
      return res.status(200).json({
        success: true,
        message: "successfully updated",
      });
    } catch (error) {
      console.log(error);
    }
  },
};
