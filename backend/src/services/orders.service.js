const { pool, config } = require("../configs/db");
const sql = require("mssql");
module.exports = {
  getOrdersByOffsetBased: async (offset, limit) => {
    const data = await pool(
      `select * from Orders ORDER BY orderID OFFSET ${offset} rows FETCH NEXT ${limit} ROWS ONLY;`
    );
    return data.recordset;
  },
  getOrderByOrderID: async (orderID) => {
    const data = await pool(`SELECT * FROM Orders WHERE orderID=${orderID};`);
    return data.recordset;
  },

  createOrder: async (userID) => {
    await sql
      .connect(config)
      .then((conn) => {
        console.log("Connected to SQLServer...");
        console.log("procedure createOrder");
        conn
          .request()
          .input("userID", sql.Int, userID)
          .execute("createOrder")
          .catch((err) => {
            console.log("Database Execute Failed! Bad Config: ", err);
          });
      })
      .catch((err) => {
        console.log("Database Connection Failed! Bad Config: ", err);
      });
  },
  updateOrder: async (order) => {
    const { orderID, status } = order;
    const data = await pool(
      `UPDATE Orders SET status=${status} WHERE orderID=${orderID};`
    );
    return data.recordset;
    await sql
      .connect(config)
      .then((conn) => {
        console.log("Connected to SQLServer...");
        console.log("procedure updateOrder");
        conn
          .request()
          .input("orderID", sql.Int, orderID)
          .input("status", sql.NVarChar(255), status)
          .execute("updateOrder")
          .catch((err) => {
            console.log("Database Execute Failed! Bad Config: ", err);
          });
      })
      .catch((err) => {
        console.log("Database Connection Failed! Bad Config: ", err);
      });
  },
};
