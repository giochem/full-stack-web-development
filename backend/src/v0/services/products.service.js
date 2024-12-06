const { pool, config } = require("../configs/db");
const sql = require("mssql");
const { Message } = require("../utils/constants");

module.exports = {
  getProductsByOffsetBased: async (
    offset,
    limit,
    sortBy,
    sortOrder,
    searchText,
    filterPromotion,
    filterCategory
  ) => {
    let conn;
    conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getProductsByOffsetBased");

    const data = await conn
      .request()
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .input("sortBy", sql.NVarChar(255), sortBy)
      .input("sortOrder", sql.NVarChar(255), sortOrder)
      .input("searchText", sql.NVarChar(255), searchText)
      .input("filterPromotion", sql.NVarChar(255), filterPromotion)
      .input("filterCategory", sql.NVarChar(255), filterCategory)
      .execute("getProductsByOffsetBased");

    return data.recordset;
  },
  getProductByProductID: async (productID) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getProductByProductID");

    const data = await conn
      .request()
      .input("productID", sql.Int, productID)
      .execute("getProductByProductID");

    return data.recordset;
  },
  createProduct: async (product) => {
    let conn;
    const { promotionID, categoryID, name, description, image } = product;

    conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure createProduct");

    const data = await conn
      .request()
      .input("promotionID", sql.Int, promotionID)
      .input("categoryID", sql.Int, categoryID)
      .input("name", sql.NVarChar(255), name)
      .input("description", sql.Text, description)
      .input("image", sql.NVarChar(255), image)
      .execute("createProduct");

    return data.recordset;
  },
  createProductItem: async (product) => {
    const { productID, productList } = product;
    const { variationID, variationOptionID, price, quantity } = productList[0];
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure createProductItem");

    const data = await conn
      .request()
      .input("productID", sql.Int, productID)
      .input("variationID", sql.Int, variationID)
      .input("variationOptionID", sql.Int, variationOptionID)
      .input("price", sql.Int, price)
      .input("quantity", sql.Int, quantity)
      .execute("createProductItem");
  },
  updateProduct: async (product) => {
    const { productID, promotionID, categoryID, name, description, image } =
      product;
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure updateProduct");

    await conn
      .request()
      .input("productID", sql.Int, productID)
      .input("promotionID", sql.Int, promotionID)
      .input("categoryID", sql.Int, categoryID)
      .input("name", sql.NVarChar(255), name)
      .input("description", sql.Text, description)
      .input("image", sql.NVarChar(255), image)
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
