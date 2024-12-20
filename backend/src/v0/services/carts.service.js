import { pool, config } from "../configs/db.js";
import sql from "mssql";

export const getCartsByOffsetBased = async ({
  offset,
  limit,
  searchText,
  sortBy,
  sortOrder
}) => {
  const conn = await sql.connect(config);
  console.log("Connected to SQLServer...");
  console.log("procedure getCartsByOffsetBased");
  const data = await conn
    .request()
    .input("offset", sql.Int, offset)
    .input("limit", sql.Int, limit)
    .input("searchText", sql.NVarChar(255), searchText)
    .input("sortBy", sql.VarChar(255), sortBy)
    .input("sortOrder", sql.VarChar(255), sortOrder)
    .execute("getCartsByOffsetBased");

  return data.recordset;
};

export const getCartByUserID = async (userID) => {
  const conn = await sql.connect(config);
  console.log("Connected to SQLServer...");
  console.log("procedure getCartByUserID");

  const data = await conn
    .request()
    .input("userID", sql.Int, userID)
    .execute("getCartByUserID");

  return data.recordset;
};

export const upsertCart = async (cart) => {
  const { userID, productItemID, quantity } = cart;
  const conn = await sql.connect(config);
  console.log("Connected to SQLServer...");
  console.log("procedure upsertCart");

  await conn
    .request()
    .input("userID", sql.Int, userID)
    .input("productItemID", sql.Int, productItemID)
    .input("quantity", sql.Int, quantity)
    .execute("upsertCart");
};
