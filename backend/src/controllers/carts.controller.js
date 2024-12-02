const cartService = require("../services/carts.service");
const Response = require("../configs/response");
const { Message, StatusCode } = require("../utils/constants");

module.exports = {
  getCarts: async (req, res, next) => {
    const { page, size } = req.query;
    const offset = page * size;
    const data = await cartService.getCartsByOffsetBased(offset, size);
    return Response.success(res, Message.SUCCESS_GET_CART, data, StatusCode.OK);
  },

  getCart: async (req, res, next) => {
    const { userID } = req.params;
    const data = await cartService.getCartByUserID(userID);
    if (!data || data.length === 0) {
      return Response.error(res, Message.ERROR_CART_NOT_FOUND, null, StatusCode.NOT_FOUND);
    }
    return Response.success(res, Message.SUCCESS_GET_CART, data, StatusCode.OK);
  },

  updateCart: async (req, res, next) => {
    const { userID, productID, quantity } = req.body;
    await cartService.updateCart({ userID, productID, quantity });
    return Response.success(res, Message.SUCCESS_UPDATE_CART, null, StatusCode.OK);
  },
};
