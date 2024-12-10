const { pool, config } = require("../configs/db");
const sql = require("mssql");

module.exports = {
  getPayments: async () => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getPayments");

    const data = await conn.request().execute("getPayments");

    return data.recordset;
  },

  upsertPayment: async (payment) => {
    const { paymentID, name, price } = payment;
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure upsertPayment");

    const data = await conn
      .request()
      .input("paymentID", sql.Int, paymentID || null)
      .input("name", sql.NVarChar(255), name)
      .input("price", sql.Float, price)
      .execute("upsertPayment");

    return data.recordset;
  },

  deletePaymentByPaymentID: async (paymentID) => {
    const conn = await sql.connect(config);
    console.log(paymentID);
    console.log("Connected to SQLServer...");
    console.log("procedure deletePayment");

    await conn
      .request()
      .input("paymentID", sql.Int, paymentID)
      .execute("deletePayment");
  },
};
