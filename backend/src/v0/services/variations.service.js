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
    const { variationID, nameAtribute, variationOptionID, value } = variation;
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure upsertVariation");

    const data = await conn
      .request()
      .input("variationID", sql.Int, variationID)
      .input("nameAtribute", sql.NVarChar(255), nameAtribute)
      .input("variationOptionID", sql.Int, variationOptionID)
      .input("value", sql.NVarChar(255), value)
      .execute("upsertVariation");

    return data.recordset;
  },

  deleteVariation: async (variation) => {
    const { variationID, variationOptionID } = variation;
    const conn = await sql.connect(config);
    console.log(variationID, variationOptionID);
    console.log("Connected to SQLServer...");
    console.log("procedure deleteVariation");

    await conn
      .request()
      .input("variationID", sql.Int, variationID)
      .input("variationOptionID", sql.Int, variationOptionID)
      .execute("deleteVariation");
  },
};
