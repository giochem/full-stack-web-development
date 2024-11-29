const cartService = require("../services/carts.service");
module.exports = {
  getCarts: async (req, res, next) => {
    try {
      const { page, size } = req.query;
      const offset = page * size;
      const data = await cartService.getCartsByOffsetBased(offset, size);
      res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.log(error);
    }
  },
  getCart: async (req, res, next) => {
    try {
      const { userID } = req.params;
      const data = await cartService.getCartByUserID(userID);
      res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
    }
  },
  updateCart: async (req, res, next) => {
    try {
      // @userID int, @productID int, @quantity int
      const { userID, productID, quantity } = req.body;

      await cartService.updateCart({ userID, productID, quantity });
      return res.status(200).json({
        success: true,
        message: "successfully updated",
      });
    } catch (error) {
      console.log(error);
    }
  },
};
