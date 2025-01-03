import { pool, config } from "../configs/db.js";
import sql from "mssql";

export const getPromotions = async () => {
  const conn = await sql.connect(config);
  console.log("Connected to SQLServer...");
  console.log("procedure getPromotions");

  const data = await conn.request().execute("getPromotions");

  return data.recordset;
};

export const upsertPromotion = async (promotion) => {
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
};

export const deletePromotion = async (promotionID) => {
  const conn = await sql.connect(config);
  console.log("Connected to SQLServer...");
  console.log("procedure deletePromotion");

  await conn
    .request()
    .input("promotionID", sql.Int, promotionID)
    .execute("deletePromotion");
};
