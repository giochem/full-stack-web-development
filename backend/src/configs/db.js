const sql = require("mssql");

const config = {
  user: process.env.SQL_SERVER_USER,
  password: process.env.SQL_SERVER_PASSWORD,
  server: process.env.SQL_SERVER_SERVER,
  database: process.env.SQL_SERVER_DATABASE,
  options: {
    trustedConnection: true,
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

const pool = async (query) => {
  return await new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
      console.log("Connected to SQLServer...");
      console.log(query);
      return pool.request().query(query);
    })
    .catch((err) =>
      console.log("Database Connection Failed! Bad Config: ", err)
    );
};

module.exports = { pool, config };
