import { pool, config } from "../configs/db.js";
import sql from "mssql";

export const getVariations = async () => {
  const conn = await sql.connect(config);
  console.log("Connected to SQLServer...");
  console.log("procedure getVariations");

  const data = await conn.request().execute("getVariations");

  return data.recordset;
};

export const upsertVariation = async (variation) => {
  const { variationID, nameAtribute } = variation;
  const conn = await sql.connect(config);
  console.log("Connected to SQLServer...");
  console.log("procedure upsertVariation");

  const data = await conn
    .request()
    .input("variationID", sql.Int, variationID || null)
    .input("nameAtribute", sql.NVarChar(255), nameAtribute)
    .execute("upsertVariation");

  return data.recordset;
};

export const deleteVariationByVariationID = async (variationID) => {
  const conn = await sql.connect(config);
  console.log(variationID);
  console.log("Connected to SQLServer...");
  console.log("procedure deleteVariation");

  await conn
    .request()
    .input("variationID", sql.Int, variationID)
    .execute("deleteVariation");
};
