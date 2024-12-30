import "dotenv/config";

const config = {
  development: {
    name: "development",
    port: process.env.DEV_PORT || 5000,
    corsOrigin: process.env.DEV_CORS_ORIGIN?.split(",") || [
      "http://localhost:5173"
    ],
    sqlServer: {
      user: process.env.DEV_SQL_SERVER_USER || "admin",
      password: process.env.DEV_SQL_SERVER_PASSWORD || "1",
      server: process.env.DEV_SQL_SERVER_SERVER || "localhost",
      database: process.env.DEV_SQL_SERVER_DATABASE || "clothes369"
    }
  },
  production: {
    name: "production",
    port: process.env.PORT || 3000,
    corsOrigin: process.env.CORS_ORIGIN?.split(",") || [
      // "http://localhost:5173",
      "http://localhost:8080"
    ],
    sqlServer: {
      user: process.env.SQL_SERVER_USER,
      password: process.env.SQL_SERVER_PASSWORD,
      server: process.env.SQL_SERVER_SERVER,
      database: process.env.SQL_SERVER_DATABASE
    }
  }
};

const env = process.env.NODE_ENV || "development";

export const configEnv = config[env];
