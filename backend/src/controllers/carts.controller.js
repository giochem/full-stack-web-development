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
  getOwnerCart: async (req, res, next) => {
    const data = await cartService.getCartByUserID(req.session.userID);
    return Response.success(res, Message.SUCCESS_GET_CART, data, StatusCode.OK);
  },
  getCart: async (req, res, next) => {
    const { userID } = req.params;
    const data = await cartService.getCartByUserID(userID);
    return Response.success(res, Message.SUCCESS_GET_CART, data, StatusCode.OK);
  },

  updateCart: async (req, res, next) => {
    const { productID, quantity } = req.body;
    await cartService.updateCart({
      userID: req.session.userID,
      productID,
      quantity,
    });
    return Response.success(
      res,
      Message.SUCCESS_UPDATE_CART,
      null,
      StatusCode.OK
    );
  },
};
