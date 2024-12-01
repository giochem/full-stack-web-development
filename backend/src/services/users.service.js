const { pool } = require("../configs/db");

module.exports = {
  getUsersByOffsetBased: async (offset, limit) => {
    const data = await pool(
      `select * from Users ORDER BY userID OFFSET ${offset} rows FETCH NEXT ${limit} ROWS ONLY;`
    );
    return data.recordset;
  },
  getUsersByKeysetBased: async (lastID, limit) => {
    if (!lastID) {
      return await module.exports.getUsersByOffsetBased(0, limit);
    }
    const data = await pool(
      `select top ${limit} * from Users Where userID > ${lastID} Order By userID;`
    );
    return data.recordset;
  },
  getUser: async (user) => {
    const { userID } = user;
    const data = await pool(`SELECT * FROM Users WHERE userID=${userID};`);
    return data.recordset;
  },
  getUserByEmail: async (email) => {
    const data = await pool(`SELECT * FROM Users WHERE email='${email}';`);
    return data.recordset;
  },
  createUser: async (user) => {
    const { username, email, password, role } = user;
    const createAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    const data = await pool(
      `INSERT INTO Users (username, email, password, role, createAt) OUTPUT inserted.userID, inserted.role
      VALUES ('${username}','${email}','${password}','${role}','${createAt}');`
    );

    return data.recordset;
  },
  updateUser: async (user) => {
    const { userID, username, email, password, role } = user;
    const updateAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    await pool(`UPDATE Users
      SET username='${username}', email='${email}', password='${password}', role='${role}', updateAt='${updateAt}'
      WHERE userID=${userID};`);
  },
  deleteUser: async (user) => {
    const { userID } = user;
    const users = await pool(`DELETE FROM Users WHERE userID=${userID};`);
    return users.recordset;
  },
};
