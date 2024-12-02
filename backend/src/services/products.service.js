const { pool, config } = require("../configs/db");
const sql = require("mssql");

module.exports = {
  getProductsByOffsetBased: async (offset, limit) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getProductsByOffsetBased");
    
    const data = await conn
      .request()
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query("SELECT * FROM Products ORDER BY productID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY");
    
    return data.recordset;
  },

  getProductByProductID: async (productID) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getProductByProductID");
    
    const data = await conn
      .request()
      .input("productID", sql.Int, productID)
      .query("SELECT * FROM Products WHERE productID = @productID");
    
    return data.recordset;
  },

  createProduct: async (product) => {
    const { name, description, color, size, linkImage, price, quantity } = product;
    const createAt = new Date().toISOString().slice(0, 19).replace("T", " ");
    
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure createProduct");
    
    const data = await conn
      .request()
      .input("name", sql.NVarChar(255), name)
      .input("description", sql.Text, description)
      .input("color", sql.NVarChar(255), color)
      .input("size", sql.VarChar(255), size)
      .input("linkImage", sql.NVarChar(255), linkImage)
      .input("price", sql.Int, price)
      .input("quantity", sql.SmallInt, quantity)
      .input("createAt", sql.DateTime, createAt)
      .query("INSERT INTO Products (name, description, color, size, linkImage, price, quantity, createAt) VALUES (@name, @description, @color, @size, @linkImage, @price, @quantity, @createAt); SELECT SCOPE_IDENTITY() AS productID;");
    
    return data.recordset;
  },

  updateProduct: async (product) => {
    const { productID, name, description, color, size, linkImage, price, quantity } = product;
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure updateProduct");
    
    await conn
      .request()
      .input("productID", sql.Int, productID)
      .input("name", sql.NVarChar(255), name)
      .input("description", sql.Text, description)
      .input("color", sql.NVarChar(255), color)
      .input("size", sql.VarChar(255), size)
      .input("linkImage", sql.NVarChar(255), linkImage)
      .input("price", sql.Int, price)
      .input("quantity", sql.SmallInt, quantity)
      .execute("updateProduct");
  },

  deleteProduct: async (productID) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure deleteProduct");
    
    await conn
      .request()
      .input("productID", sql.Int, productID)
      .execute("deleteProduct");
  },
};
