const { pool, config } = require("../configs/db");
const sql = require("mssql");

module.exports = {
  getOrdersByOffsetBased: async (offset, limit) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getOrdersByOffsetBased");

    const data = await conn
      .request()
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(
        "SELECT * FROM Orders ORDER BY orderID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY"
      );

    return data.recordset;
  },
  getOrdersByUserID: async (userID) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getOrdersByUserID");

    const data = await conn
      .request()
      .input("userID", sql.Int, userID)
      .execute("getOrdersByUserID");

    return data.recordset;
  },

  getOrderItemByOrderID: async (orderID) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getOrderItemByOrderID");

    const data = await conn
      .request()
      .input("orderID", sql.Int, orderID)
      .execute("getOrderItemByOrderID");

    return data.recordsets;
  },

  createOrderByUserID: async (userID) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure createOrder");

    await conn
      .request()
      .input("userID", sql.Int, userID)
      .execute("createOrder");
  },

  updateOrder: async (order) => {
    const { orderID, status } = order;
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure updateOrder");

    await conn
      .request()
      .input("orderID", sql.Int, orderID)
      .input("status", sql.NVarChar(255), status)
      .execute("updateOrder");
  },
};
