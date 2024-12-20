import orderService from "../services/orders.service.js";
import Response from "../configs/response.js";
import { Message, StatusCode } from "../utils/constants.js";

export const getOrders = async (req, res, next) => {
  try {
    const {
      page,
      size,
      searchText,
      sortBy,
      sortOrder,
      filterStatus,
      userID
    } = req.query;
    const offset = page * size;
    if (userID) {
      const data = await orderService.getOrdersByUserID(userID);
      return Response.success(
        res,
        Message.SUCCESS_GET_ORDERS,
        data,
        StatusCode.OK
      );
    }
    const data = await orderService.getOrdersByOffsetBased({
      offset,
      limit: size,
      searchText,
      sortBy,
      sortOrder,
      filterStatus
    });
    return Response.success(
      res,
      Message.SUCCESS_GET_ORDERS,
      data,
      StatusCode.OK
    );
  } catch (error) {
    console.error("Error in getOrders controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const getOwnerOrders = async (req, res, next) => {
  try {
    const { userID } = req.session;
    const data = await orderService.getOrdersByUserID(userID);
    return Response.success(
      res,
      Message.SUCCESS_GET_ORDERS,
      data,
      StatusCode.OK
    );
  } catch (error) {
    console.error("Error in getOwnerOrders controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { fullName, phone, address, note } = req.body;
    await orderService.createOrder({
      userID: req.session.userID,
      fullName,
      phone,
      address,
      note
    });
    return Response.success(
      res,
      Message.SUCCESS_CREATE_ORDER,
      null,
      StatusCode.CREATED
    );
  } catch (error) {
    console.error("Error in createOrder controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
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
      status
    });
    return Response.success(
      res,
      Message.SUCCESS_UPDATE_ORDER,
      null,
      StatusCode.OK
    );
  } catch (error) {
    console.error("Error in updateOrder controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};
