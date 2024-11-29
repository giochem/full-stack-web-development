const { pool, config } = require("../configs/db");
const sql = require("mssql");
module.exports = {
  getCollectionsByOffsetBased: async (offset, limit) => {
    const data = await pool(
      `select * from Collections ORDER BY collectionID OFFSET ${offset} rows FETCH NEXT ${limit} ROWS ONLY;`
    );
    return data.recordset;
  },
  getCollectionByCollectionID: async (collectionID) => {
    const data = await pool(
      `SELECT * FROM Collections WHERE collectionID=${collectionID};`
    );
    return data.recordset;
  },
  getCollectionByName: async (name) => {
    const data = await pool(`SELECT * FROM Collections WHERE name='${name}';`);
    return data.recordset;
  },
  createCollection: async (collecion) => {
    const { name } = collecion;
    const createAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    const data = await pool(
      `INSERT INTO Collections (name, createAt)
      VALUES ('${name}', '${createAt}');`
    );
    return data.recordset;
  },
  updateCollection: async (collection) => {
    const { collectionID, name, productIDs } = collection;
    await sql
      .connect(config)
      .then((conn) => {
        console.log("Connected to SQLServer...");
        console.log("procedure updateCollection");
        conn
          .request()
          .input("collectionID", sql.Int, collectionID)
          .input("name", sql.NVarChar(255), name)
          .input("productIDs", sql.VarChar(255), productIDs)
          .execute("updateCollection")
          .catch((err) => {
            console.log("Database Execute Failed! Bad Config: ", err);
          });
      })
      .catch((err) => {
        console.log("Database Connection Failed! Bad Config: ", err);
      });
  },
  deleteCollection: async (collectionID) => {
    await sql
      .connect(config)
      .then((conn) => {
        console.log("Connected to SQLServer...");
        console.log("procedure deleteCollections");
        conn
          .request()
          .input("collectionID", sql.Int, collectionID)
          .execute("deleteCollection")
          .catch((err) => {
            console.log("Database Execute Failed! Bad Config: ", err);
          });
      })
      .catch((err) => {
        console.log("Database Connection Failed! Bad Config: ", err);
      });
  },
};
