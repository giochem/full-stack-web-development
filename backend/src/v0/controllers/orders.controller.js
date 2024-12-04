const orderService = require("../services/orders.service");
const Response = require("../configs/response");
const { Message, StatusCode } = require("../utils/constants");

module.exports = {
  getOrders: async (req, res, next) => {
    const { page, size } = req.query;
    const offset = page * size;
    const data = await orderService.getOrdersByOffsetBased(offset, size);
    return Response.success(
      res,
      Message.SUCCESS_GET_ORDERS,
      data,
      StatusCode.OK
    );
  },
  getOwnerOrders: async (req, res, next) => {
    const { userID } = req.session;
    const data = await orderService.getOrdersByUserID(userID);
    return Response.success(
      res,
      Message.SUCCESS_GET_ORDERS,
      data,
      StatusCode.OK
    );
  },
  getOrderItem: async (req, res, next) => {
    const { orderID } = req.params;
    const data = await orderService.getOrderItemByOrderID(orderID);
    if (!data || data.length === 0) {
      return Response.error(
        res,
        Message.ERROR_ORDER_NOT_FOUND,
        null,
        StatusCode.NOT_FOUND
      );
    }
    return Response.success(
      res,
      Message.SUCCESS_GET_ORDER,
      data,
      StatusCode.OK
    );
  },

  createOrder: async (req, res, next) => {
    const { fullName, phone, address, note } = req.body;
    await orderService.createOrder({
      userID: req.session.userID,
      fullName,
      phone,
      address,
      note,
    });
    return Response.success(
      res,
      Message.SUCCESS_CREATE_ORDER,
      null,
      StatusCode.CREATED
    );
  },

  updateOrder: async (req, res, next) => {
    const { status } = req.body;
    const { orderID } = req.params;

    const order = await orderService.getOrderByOrderID(orderID);
    if (!order || order.length === 0) {
      return Response.error(
        res,
        Message.ERROR_ORDER_NOT_FOUND,
        null,
        StatusCode.NOT_FOUND
      );
    }

    await orderService.updateOrder({
      orderID,
      status,
    });
    return Response.success(
      res,
      Message.SUCCESS_UPDATE_ORDER,
      null,
      StatusCode.OK
    );
  },
};
