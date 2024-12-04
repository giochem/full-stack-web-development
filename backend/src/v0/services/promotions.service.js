const { pool, config } = require("../configs/db");
const sql = require("mssql");

module.exports = {
  getPromotionsByOffsetBased: async (offset, limit) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getPromotionsByOffsetBased");
    
    const data = await conn
      .request()
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query("SELECT * FROM Promotions ORDER BY promotionID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY");
    
    return data.recordset;
  },

  getPromotionByPromotionID: async (promotionID) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getPromotionByPromotionID");
    
    const data = await conn
      .request()
      .input("promotionID", sql.Int, promotionID)
      .query("SELECT * FROM Promotions WHERE promotionID = @promotionID");
    
    return data.recordset;
  },

  getPromotionByName: async (name) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getPromotionByName");
    
    const data = await conn
      .request()
      .input("name", sql.NVarChar(255), name)
      .query("SELECT * FROM Promotions WHERE name = @name");
    
    return data.recordset;
  },

  createPromotion: async (promotion) => {
    const { name, reduce, startTime, endTime } = promotion;
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure createPromotion");
    
    const data = await conn
      .request()
      .input("name", sql.NVarChar(255), name)
      .input("reduce", sql.TinyInt, reduce)
      .input("startTime", sql.DateTime, startTime)
      .input("endTime", sql.DateTime, endTime)
      .query("INSERT INTO Promotions (name, reduce, startTime, endTime) VALUES (@name, @reduce, @startTime, @endTime); SELECT SCOPE_IDENTITY() AS promotionID;");
    
    return data.recordset;
  },

  updatePromotion: async (promotion) => {
    const { promotionID, name, reduce, startTime, endTime, productIDs } = promotion;
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure updatePromotion");
    
    await conn
      .request()
      .input("promotionID", sql.Int, promotionID)
      .input("name", sql.NVarChar(255), name)
      .input("reduce", sql.TinyInt, reduce)
      .input("startTime", sql.DateTime, startTime)
      .input("endTime", sql.DateTime, endTime)
      .input("productIDs", sql.VarChar(255), productIDs)
      .execute("updatePromotion");
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
