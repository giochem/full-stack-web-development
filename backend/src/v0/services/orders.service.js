const { pool, config } = require("../configs/db");
const sql = require("mssql");
const { Message } = require("../utils/constants");

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
  createOrder: async (order) => {
    let conn;
    try {
      const { userID, fullName, phone, address, note } = order;
      conn = await sql.connect(config);
      console.log("Connected to SQLServer...");
      console.log("procedure createOrder");

      await conn
        .request()
        .input("userID", sql.Int, userID)
        .input("fullName", sql.NVarChar(255), fullName)
        .input("phone", sql.VarChar(255), phone)
        .input("address", sql.NVarChar(255), address)
        .input("note", sql.NVarChar(255), note)
        .execute("createOrder");
    } catch (error) {
      console.error("Error in createOrder:", error);
      throw error;
    } finally {
      if (conn) {
        await conn.close();
        console.log("Connection closed.");
      }
    }
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
