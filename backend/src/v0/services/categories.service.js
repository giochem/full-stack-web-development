import { pool, config } from "../configs/db.js";
import sql from "mssql";

export const getCategories = async () => {
  const conn = await sql.connect(config);
  console.log("Connected to SQLServer...");
  console.log("procedure getCategories");

  const data = await conn.request().execute("getCategories");

  return data.recordset;
};

export const upsertCategory = async (category) => {
  const { categoryID, parentCategoryID, name } = category;
  const conn = await sql.connect(config);
  console.log("Connected to SQLServer...");
  console.log("procedure upsertCategory");

  await conn
    .request()
    .input("categoryID", sql.Int, categoryID)
    .input("parentCategoryID", sql.Int, parentCategoryID)
    .input("name", sql.NVarChar(255), name)
    .execute("upsertCategory");
};

export const removeCategoryById = async (categoryID) => {
  const conn = await sql.connect(config);
  console.log("Connected to SQLServer...");
  console.log("procedure deleteCategory");

  await conn
    .request()
    .input("categoryID", sql.Int, categoryID)
    .execute("deleteCategory");
};
