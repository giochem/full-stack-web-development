const { pool, config } = require("../configs/db");
const sql = require("mssql");
module.exports = {
  getCartsByOffsetBased: async (offset, limit) => {
    const data = await pool(
      `select * from CartItem ORDER BY userID OFFSET ${offset} rows FETCH NEXT ${limit} ROWS ONLY;`
    );
    return data.recordset;
  },
  getCartByUserID: async (userID) => {
    const data = await pool(`SELECT * FROM CartItem WHERE userID=${userID};`);
    return data.recordset;
  },
  updateCart: async (cart) => {
    const { userID, productID, quantity } = cart;
    await sql
      .connect(config)
      .then((conn) => {
        console.log("Connected to SQLServer...");
        console.log("procedure updateCart");
        conn
          .request()
          .input("userID", sql.Int, userID)
          .input("productID", sql.Int, productID)
          .input("quantity", sql.Int, quantity)
          .execute("updateCartItem")
          .catch((err) => {
            console.log("Database Execute Failed! Bad Config: ", err);
          });
      })
      .catch((err) => {
        console.log("Database Connection Failed! Bad Config: ", err);
      });
  },
};
