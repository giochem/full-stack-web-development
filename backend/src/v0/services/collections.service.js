const { pool, config } = require("../configs/db");
const sql = require("mssql");

module.exports = {
  getCollectionsByOffsetBased: async (offset, limit) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getCollectionsByOffsetBased");
    
    const data = await conn
      .request()
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query("SELECT * FROM Collections ORDER BY collectionID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY");
    
    return data.recordset;
  },

  getCollectionByCollectionID: async (collectionID) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getCollectionByCollectionID");
    
    const data = await conn
      .request()
      .input("collectionID", sql.Int, collectionID)
      .query("SELECT * FROM Collections WHERE collectionID = @collectionID");
    
    return data.recordset;
  },

  getCollectionByName: async (name) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getCollectionByName");
    
    const data = await conn
      .request()
      .input("name", sql.NVarChar(255), name)
      .query("SELECT * FROM Collections WHERE name = @name");
    
    return data.recordset;
  },

  createCollection: async (collection) => {
    const { name } = collection;
    const createAt = new Date().toISOString().slice(0, 19).replace("T", " ");
    
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure createCollection");
    
    const data = await conn
      .request()
      .input("name", sql.NVarChar(255), name)
      .input("createAt", sql.DateTime, createAt)
      .query("INSERT INTO Collections (name, createAt) VALUES (@name, @createAt); SELECT SCOPE_IDENTITY() AS collectionID;");
    
    return data.recordset;
  },

  updateCollection: async (collection) => {
    const { collectionID, name, productIDs } = collection;
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure updateCollection");
    
    await conn
      .request()
      .input("collectionID", sql.Int, collectionID)
      .input("name", sql.NVarChar(255), name)
      .input("productIDs", sql.VarChar(255), productIDs)
      .execute("updateCollection");
  },

  deleteCollection: async (collectionID) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure deleteCollection");
    
    await conn
      .request()
      .input("collectionID", sql.Int, collectionID)
      .execute("deleteCollection");
  },
};
