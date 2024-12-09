const { pool, config } = require("../configs/db");
const sql = require("mssql");

module.exports = {
  getPromotions: async () => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getPromotions");

    const data = await conn.request().execute("getPromotions");

    return data.recordset;
  },

  upsertPromotion: async (promotion) => {
    const { promotionID, name, discount, startDate, endDate } = promotion;
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure upsertPromotion");

    await conn
      .request()
      .input("promotionID", sql.Int, promotionID)
      .input("name", sql.NVarChar(255), name)
      .input("discount", sql.TinyInt, discount)
      .input("startDate", sql.DateTime, startDate)
      .input("endDate", sql.DateTime, endDate)
      .execute("upsertPromotion");
  },

  deletePromotion: async (promotionID) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure deletePromotion");

    await conn
      .request()
      .input("promotionID", sql.Int, promotionID)
      .execute("deletePromotion");
  },
};
