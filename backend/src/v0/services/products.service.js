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

    const result = await conn
      .request()
      .input("productID", sql.Int, productID)
      .execute("getProductByProductID");

    return result.recordsets;
  },
  createProduct: async (product) => {
    const { promotionID, categoryID, name, description, image, productList } =
      product;

    console.log("Connected to SQLServer...");
    console.log("procedure createProduct");
    const conn = await sql.connect(config);
    const productItemList = new sql.Table("productItemList");
    productItemList.create = true;
    productItemList.columns.add("sku", sql.VarChar(255));
    productItemList.columns.add("price", sql.Int);
    productItemList.columns.add("quantity", sql.Int);
    productItemList.columns.add("image", sql.NVarChar(255));
    productItemList.columns.add("variationOptionIDs", sql.VarChar(255));

    productList.forEach((item) => {
      productItemList.rows.add(
        item.sku,
        item.price,
        item.quantity,
        item.image,
        item.variationOptionIDs.join(",")
      );
    });

    const result = await conn
      .request()
      .input("name", sql.NVarChar(255), name)
      .input("description", sql.Text, description)
      .input("image", sql.NVarChar(255), image)
      .input("promotionID", sql.Int, promotionID)
      .input("categoryID", sql.Int, categoryID)
      .input("productItemTable", productItemList)
      .execute("createProduct");
    await conn.close();
    console.log("Connection closed.");
  },
  updateProduct: async (product) => {
    const {
      productID,
      promotionID,
      categoryID,
      name,
      description,
      image,
      productList,
    } = product;
    const conn = await sql.connect(config);
    const productItemList = new sql.Table("productItemList");
    productItemList.create = true;
    productItemList.columns.add("productItemID", sql.Int);
    productItemList.columns.add("sku", sql.VarChar(255));
    productItemList.columns.add("price", sql.Int);
    productItemList.columns.add("quantity", sql.Int);
    productItemList.columns.add("image", sql.NVarChar(255));
    productItemList.columns.add("variationOptionIDs", sql.VarChar(255));

    productList.forEach((item) => {
      productItemList.rows.add(
        item.productItemID,
        item.sku,
        item.price,
        item.quantity,
        item.image,
        item.variationOptionIDs.join(",")
      );
    });

    const result = await conn
      .request()
      .input("productID", sql.Int, productID)
      .input("promotionID", sql.Int, promotionID)
      .input("categoryID", sql.Int, categoryID)
      .input("name", sql.NVarChar(255), name)
      .input("description", sql.Text, description)
      .input("image", sql.NVarChar(255), image)
      .input("productItemTable", productItemList)
      .execute("updateProduct");
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
};
