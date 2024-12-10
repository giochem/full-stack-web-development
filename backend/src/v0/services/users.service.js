const { pool, config } = require("../configs/db");
const sql = require("mssql");

module.exports = {
  getUsersByOffsetBased: async ({
    offset,
    limit,
    sortBy,
    sortOrder,
    searchText,
    filterRole,
  }) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getUsersByOffsetBased");

    const data = await conn
      .request()
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .input("sortBy", sql.NVarChar(255), sortBy)
      .input("sortOrder", sql.NVarChar(255), sortOrder)
      .input("searchText", sql.NVarChar(255), searchText)
      .input("filterRole", sql.NVarChar(255), filterRole)
      .execute("getUsersByOffsetBased");

    await conn.close();
    console.log("Connection closed.");
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

    await conn.close();
    console.log("Connection closed.");
    return data.recordset;
  },

  getUserByEmail: async (email) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getUserByEmail");

    const data = await conn
      .request()
      .input("email", sql.NVarChar(255), email)
      .execute("getUserByEmail");

    await conn.close();
    console.log("Connection closed.");
    return data.recordset;
  },

  getUserByUserID: async (userID) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure getUserByUserID");

    const data = await conn
      .request()
      .input("userID", sql.Int, userID)
      .execute("getUserByUserID");

    await conn.close();
    console.log("Connection closed.");
    return data.recordset;
  },

  createUser: async (user) => {
    const { username, email, password, role } = user;

    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure createUser");

    const data = await conn
      .request()
      .input("username", sql.NVarChar(255), username)
      .input("email", sql.NVarChar(255), email)
      .input("password", sql.NVarChar(255), password)
      .input("role", sql.NVarChar(50), role)
      .execute("createUser");

    await conn.close();
    console.log("Connection closed.");
    return data.recordset;
  },

  updateUser: async (user) => {
    const { userID, username, email, password, role } = user;

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
      .execute("updateUser");

    await conn.close();
    console.log("Connection closed.");
  },
  deleteUser: async (userID) => {
    const conn = await sql.connect(config);
    console.log("Connected to SQLServer...");
    console.log("procedure deleteUser");

    await conn.request().input("userID", sql.Int, userID).execute("deleteUser");

    await conn.close();
    console.log("Connection closed.");
  },
};
