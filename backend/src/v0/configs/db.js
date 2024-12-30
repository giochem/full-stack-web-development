import sql from "mssql";
import { configEnv } from "../../configEnv.js";
export const config = {
  user: configEnv.sqlServer.user,
  password: configEnv.sqlServer.password,
  server: configEnv.sqlServer.server,
  database: configEnv.sqlServer.database,
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
