const { pool, config } = require("../configs/db");
const sql = require("mssql");

module.exports = {
  getProductsByOffsetBased: async (offset, limit) => {
    const data = await pool(
      `select * from Products ORDER BY productID OFFSET ${offset} rows FETCH NEXT ${limit} ROWS ONLY;`
    );
    return data.recordset;
  },
  getProductByProductID: async (productID) => {
    const data = await pool(
      `SELECT * FROM Products WHERE productID=${productID};`
    );
    return data.recordset;
  },
  createProduct: async (product) => {
    const { name, description, color, size, linkImage, price, quantity } =
      product;
    const createAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    const data = await pool(
      `INSERT INTO Products (name, description, color, size, linkImage, price, quantity, createAt)
      VALUES ('${name}','${description}','${color}','${size}','${linkImage}', ${price}, ${quantity},'${createAt}');`
    );
    return data.recordset;
  },
  updateProduct: async (product) => {
    const {
      productID,
      name,
      description,
      color,
      size,
      linkImage,
      price,
      quantity,
    } = product;
    await sql
      .connect(config)
      .then((conn) => {
        console.log("Connected to SQLServer...");
        console.log("procedure updateCollection");
        conn
          .request()
          .input("productID", sql.Int, productID)
          .input("name", sql.NVarChar(255), name)
          .input("description", sql.Text, description)
          .input("color", sql.NVarChar(255), color)
          .input("size", sql.VarChar(255), size)
          .input("linkImage", sql.NVarChar(255), linkImage)
          .input("price", sql.Int, price)
          .input("quantity", sql.SmallInt, quantity)
          .execute("updateProduct")
          .catch((err) => {
            console.log("Database Execute Failed! Bad Config: ", err);
          });
      })
      .catch((err) =>
        console.log("Database Connection Failed! Bad Config: ", err)
      );
    console.log("update success");
  },
  deleteProduct: async (productID) => {
    await sql
      .connect(config)
      .then((conn) => {
        console.log("Connected to SQLServer...");
        console.log("procedure deleteProduct");
        conn
          .request()
          .input("productID", sql.Int, productID)
          .execute("deleteProduct")
          .catch((err) => {
            console.log("Database Execute Failed! Bad Config: ", err);
          });
      })
      .catch((err) => {
        console.log("Database Connection Failed! Bad Config: ", err);
      });
  },
};
