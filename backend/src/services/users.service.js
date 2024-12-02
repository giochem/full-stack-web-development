const { pool, config } = require("../configs/db");
const sql = require("mssql");

module.exports = {
  getUsersByOffsetBased: async (offset, limit) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getUsersByOffsetBased");

    const data = await conn
      .request()
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(
        "SELECT * FROM Users ORDER BY userID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY"
      );

    return data.recordset;
  },

  getUsersByKeysetBased: async (lastID, limit) => {
    if (!lastID) {
      return await module.exports.getUsersByOffsetBased(0, limit);
    }

    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getUsersByKeysetBased");

    const data = await conn
      .request()
      .input("lastID", sql.Int, lastID)
      .input("limit", sql.Int, limit)
      .query(
        "SELECT TOP (@limit) * FROM Users WHERE userID > @lastID ORDER BY userID"
      );

    return data.recordset;
  },

  getUser: async (user) => {
    const { userID } = user;
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getUser");

    const data = await conn
      .request()
      .input("userID", sql.Int, userID)
      .query("SELECT * FROM Users WHERE userID = @userID");

    return data.recordset;
  },

  getUserByEmail: async (email) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getUserByEmail");

    const data = await conn
      .request()
      .input("email", sql.NVarChar(255), email)
      .query("SELECT * FROM Users WHERE email = @email");

    return data.recordset;
  },

  createUser: async (user) => {
    const { username, email, password, role } = user;
    const createAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure createUser");

    const data = await conn
      .request()
      .input("username", sql.NVarChar(255), username)
      .input("email", sql.NVarChar(255), email)
      .input("password", sql.NVarChar(255), password)
      .input("role", sql.NVarChar(50), role)
      .input("createAt", sql.DateTime, createAt)
      .query(
        "INSERT INTO Users (username, email, password, role, createAt) OUTPUT inserted.userID, inserted.role VALUES (@username, @email, @password, @role, @createAt)"
      );

    return data.recordset;
  },

  updateUser: async (user) => {
    const { userID, username, email, password, role } = user;
    const { userID, username, email, password, role } = user;
    const updateAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure updateUser");

    await conn
      .request()
      .input("userID", sql.Int, userID)
      .input("username", sql.NVarChar(255), username)
      .input("email", sql.NVarChar(255), email)
      .input("password", sql.NVarChar(255), password)
      .input("role", sql.NVarChar(50), role)
      .input("updateAt", sql.DateTime, updateAt)
      .query(
        "UPDATE Users SET username = @username, email = @email, password = @password, role = @role, updateAt = @updateAt WHERE userID = @userID"
      );
  },

  deleteUser: async (user) => {
    const { userID } = user;
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure deleteUser");

    const data = await conn
      .request()
      .input("userID", sql.Int, userID)
      .query("DELETE FROM Users WHERE userID = @userID");

    return data.recordset;
  },
};
