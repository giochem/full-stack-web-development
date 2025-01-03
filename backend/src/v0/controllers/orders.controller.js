import {
  getOrdersByOffsetBased,
  getOrdersByUserID,
  createOrder,
  updateOrder
} from "../services/orders.service.js";
import Response from "../configs/response.js";
import { Message, StatusCode } from "../utils/constants.js";

export const handleGetOrders = async (req, res, next) => {
  try {
    const { page, size, sortBy, sortOrder, searchText, filterStatus } =
      req.query;
    const offset = page * size;
    const data = await getOrdersByOffsetBased({
      offset,
      limit: size,
      sortBy,
      sortOrder,
      searchText,
      filterStatus
    });
    return Response.success(
      res,
      Message.SUCCESS_GET_ORDERS,
      data,
      StatusCode.OK
    );
  } catch (error) {
    console.error("Error in handleGetOrders controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const handleGetOwnerOrders = async (req, res, next) => {
  try {
    const data = await getOrdersByUserID(req.session.userID);
    return Response.success(
      res,
      Message.SUCCESS_GET_ORDERS,
      data,
      StatusCode.OK
    );
  } catch (error) {
    console.error("Error in handleGetOwnerOrders controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const handleCreateOrder = async (req, res, next) => {
  try {
    const { fullName, phone, address, note } = req.body;
    await createOrder({
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
    console.error("Error in handleCreateOrder controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const handleUpdateOrder = async (req, res, next) => {
  try {
    const { orderID } = req.params;
    const { status } = req.body;
    await updateOrder({
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
    console.error("Error in handleUpdateOrder controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};
