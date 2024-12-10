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
  getProductExtraInfo: async () => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getProductExtraInfo");

    const result = await conn.request().execute("getProductExtraInfo");
    return result.recordsets;
  },
  getProductByProductID: async (productID) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getProductByProductID");

    const result = await conn
      .request()
      .input("productID", sql.Int, productID)
      .execute("getProductByProductID");

    return result.recordsets;
  },
  getProductItemByProductItemID: async (productItemID) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getProductItemByProductItemID");

    const result = await conn
      .request()
      .input("productItemID", sql.Int, productItemID)
      .execute("getProductItemByProductItemID");

    return result.recordsets;
  },
  upsertProduct: async (product) => {
    const { productID, promotionID, categoryID, name, description, image } =
      product;
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure upsertProduct");

    await conn
      .request()
      .input("productID", sql.Int, productID)
      .input("promotionID", sql.Int, promotionID)
      .input("categoryID", sql.Int, categoryID)
      .input("name", sql.NVarChar(255), name)
      .input("description", sql.Text, description)
      .input("image", sql.NVarChar(255), image)
      .execute("upsertProduct");
    await conn.close();
    console.log("Connection closed.");
  },
  upsertProductItem: async (productItem) => {
    const {
      productID,
      productItemID,
      sku,
      price,
      quantity,
      image,
      variationOptionList,
    } = productItem;
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure upsertProductItem");
    const variationOptionTable = new sql.Table("variationOptionList");
    variationOptionTable.create = true;
    variationOptionTable.columns.add("variationID", sql.Int);
    variationOptionTable.columns.add("value", sql.NVarChar(255));

    variationOptionList.forEach((item) => {
      variationOptionTable.rows.add(item.variationID, item.value);
    });
    await conn
      .request()
      .input("productID", sql.Int, productID)
      .input("productItemID", sql.Int, productItemID)
      .input("sku", sql.NVarChar(255), sku)
      .input("price", sql.Int, price)
      .input("quantity", sql.Int, quantity)
      .input("image", sql.NVarChar(255), image)
      .input("variationOptionTable", variationOptionTable)
      .execute("upsertProductItem");
    await conn.close();
    console.log("Connection closed.");
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
  deleteProductItem: async (productItemID) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure deleteProductItem");

    await conn
      .request()
      .input("productItemID", sql.Int, productItemID)
      .execute("deleteProductItem");
  },
};
