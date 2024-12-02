const { pool, config } = require("../configs/db");
const sql = require("mssql");

module.exports = {
  getCartsByOffsetBased: async (offset, limit) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getCartsByOffsetBased");

    const data = await conn
      .request()
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(
        "SELECT * FROM CartItem ORDER BY userID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY"
      );

    return data.recordset;
  },

  getCartByUserID: async (userID) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getCartByUserID");

    const data = await conn
      .request()
      .input("userID", sql.Int, userID)
      .execute("getCartByUserID");

    return data.recordset;
  },

  updateCart: async (cart) => {
    const { userID, productID, quantity } = cart;
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure updateCart");

    await conn
      .request()
      .input("userID", sql.Int, userID)
      .input("productID", sql.Int, productID)
      .input("quantity", sql.Int, quantity)
      .execute("updateCartItem");
  },
};
