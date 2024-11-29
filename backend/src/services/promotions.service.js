const { pool, config } = require("../configs/db");
const sql = require("mssql");
module.exports = {
  getPromotionsByOffsetBased: async (offset, limit) => {
    const data = await pool(
      `select * from Promotions ORDER BY PromotionID OFFSET ${offset} rows FETCH NEXT ${limit} ROWS ONLY;`
    );
    return data.recordset;
  },
  getPromotionByPromotionID: async (promotionID) => {
    const data = await pool(
      `SELECT * FROM Promotions WHERE PromotionID=${promotionID};`
    );
    return data.recordset;
  },
  getPromotionByName: async (name) => {
    const data = await pool(`SELECT * FROM Promotions WHERE name='${name}';`);
    return data.recordset;
  },
  createPromotion: async (promotion) => {
    const { name, reduce, startTime, endTime } = promotion;
    const data = await pool(
      `INSERT INTO Promotions (name, reduce, startTime, endTime) 
      VALUES ('${name}',${reduce}, '${startTime}','${endTime}');`
    );
    return data.recordset;
  },
  updatePromotion: async (promotion) => {
    const { promotionID, name, reduce, startTime, endTime, productIDs } =
      promotion;
    await sql
      .connect(config)
      .then((conn) => {
        console.log("Connected to SQLServer...");
        console.log("procedure updatePromotion");
        conn
          .request()
          .input("promotionID", sql.Int, promotionID)
          .input("name", sql.NVarChar(255), name)
          .input("reduce", sql.TinyInt, reduce)
          .input("startTime", sql.DateTime, startTime)
          .input("endTime", sql.DateTime, endTime)
          .input("productIDs", sql.VarChar(255), productIDs)
          .execute("updatePromotion")
          .catch((err) => {
            console.log("Database Execute Failed! Bad Config: ", err);
          });
      })
      .catch((err) => {
        console.log("Database Connection Failed! Bad Config: ", err);
      });
  },
  deletePromotion: async (promotionID) => {
    await sql
      .connect(config)
      .then((conn) => {
        console.log("Connected to SQLServer...");
        console.log("procedure deletePromotion");
        conn
          .request()
          .input("promotionID", sql.Int, promotionID)
          .execute("deletePromotion")
          .catch((err) => {
            console.log("Database Execute Failed! Bad Config: ", err);
          });
      })
      .catch((err) => {
        console.log("Database Connection Failed! Bad Config: ", err);
      });
  },
};
