import sql from "mssql";

export const config = {
  user: process.env.SQL_SERVER_USER,
  password: process.env.SQL_SERVER_PASSWORD,
  server: process.env.SQL_SERVER_SERVER,
  database: process.env.SQL_SERVER_DATABASE,
  options: {
    trustedConnection: true,
    enableArithAbort: true,
    trustServerCertificate: true
    // instanceName: "SQLEXPRESS"
  },
  pool: {
    max: 1000,
    min: 0,
    idleTimeoutMillis: 30000
  },
  connectionTimeout: 30000,
  requestTimeout: 30000,
  stream: false,
  parseJSON: true
};

export const pool = async (query) => {
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
