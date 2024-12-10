const cartService = require("../services/carts.service");
const Response = require("../configs/response");
const { Message, StatusCode } = require("../utils/constants");

module.exports = {
  getCarts: async (req, res, next) => {
    try {
      const { page, size, searchText, sortBy, sortOrder, userID } = req.query;
      if (userID) {
        const data = await cartService.getCartByUserID(userID);
        return Response.success(
          res,
          Message.SUCCESS_GET_CART,
          data,
          StatusCode.OK
        );
      }
      const offset = page * size;
      const data = await cartService.getCartsByOffsetBased({
        offset,
        limit: size,
        searchText,
        sortBy,
        sortOrder,
      });
      return Response.success(
        res,
        Message.SUCCESS_GET_CART,
        data,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in getCarts controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },
  getCart: async (req, res, next) => {
    try {
      const { userID } = req.params;
      const data = await cartService.getCartByUserID(userID);
      return Response.success(
        res,
        Message.SUCCESS_GET_CART,
        data,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in getCart controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },
  getOwnerCart: async (req, res, next) => {
    try {
      const data = await cartService.getCartByUserID(req.session.userID);
      return Response.success(
        res,
        Message.SUCCESS_GET_CART,
        data,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in getOwnerCart controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },
  upsertCart: async (req, res, next) => {
    try {
      let { userID, productItemID, quantity } = req.body;
      if (!userID) {
        userID = req.session.userID;
      }
      await cartService.upsertCart({
        userID,
        productItemID,
        quantity,
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
  },
};
