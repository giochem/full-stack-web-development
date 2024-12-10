const { pool, config } = require("../configs/db");
const sql = require("mssql");

module.exports = {
  getVariations: async () => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getVariations");

    const data = await conn.request().execute("getVariations");

    return data.recordset;
  },

  upsertVariation: async (variation) => {
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
  },

  deleteVariationByVariationID: async (variationID) => {
    const conn = await sql.connect(config);
    console.log(variationID);
    console.log("Connected to SQLServer...");
    console.log("procedure deleteVariation");

    await conn
      .request()
      .input("variationID", sql.Int, variationID)
      .execute("deleteVariation");
  },
};
