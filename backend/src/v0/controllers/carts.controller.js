import {
  getCartByUserID,
  getCartsByOffsetBased,
  upsertCart
} from "../services/carts.service.js";
import Response from "../configs/response.js";
import { Message, StatusCode } from "../utils/constants.js";

export const handleGetCarts = async (req, res, next) => {
  try {
    const { page, size, searchText, sortBy, sortOrder, userID } = req.query;
    if (userID) {
      const data = await getCartByUserID(userID);
      return Response.success(
        res,
        Message.SUCCESS_GET_CART,
        data,
        StatusCode.OK
      );
    }
    const offset = page * size;
    const data = await getCartsByOffsetBased({
      offset,
      limit: size,
      searchText,
      sortBy,
      sortOrder
    });
    return Response.success(res, Message.SUCCESS_GET_CART, data, StatusCode.OK);
  } catch (error) {
    console.error("Error in getCarts controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const handleGetCart = async (req, res, next) => {
  try {
    const { userID } = req.params;
    const data = await getCartByUserID(userID);
    return Response.success(res, Message.SUCCESS_GET_CART, data, StatusCode.OK);
  } catch (error) {
    console.error("Error in getCart controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const handleGetOwnerCart = async (req, res, next) => {
  try {
    const data = await getCartByUserID(req.session.userID);
    return Response.success(res, Message.SUCCESS_GET_CART, data, StatusCode.OK);
  } catch (error) {
    console.error("Error in getOwnerCart controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const handleUpsertCart = async (req, res, next) => {
  try {
    let { userID, productItemID, quantity } = req.body;
    if (!userID) {
      userID = req.session.userID;
    }
    await upsertCart({
      userID,
      productItemID,
      quantity
    });
    return Response.success(
      res,
      Message.SUCCESS_UPSERT_CART,
      null,
      StatusCode.OK
    );
  } catch (error) {
    console.error("Error in updateCart controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};
