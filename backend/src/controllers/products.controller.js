const productService = require("../services/products.service");
const fs = require("fs");

module.exports = {
  getProducts: async (req, res, next) => {
    try {
      const { page, size } = req.query;
      const offset = page * size;
      const data = await productService.getProductsByOffsetBased(offset, size);
      res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.log(error);
    }
  },
  getProduct: async (req, res, next) => {
    try {
      const { productID } = req.params;
      const data = await productService.getProductByProductID(productID);
      res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
    }
  },
  createProduct: async (req, res, next) => {
    try {
      const { name, description, color, size, price, quantity } = req.body;
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, error: "Not found image" });
      }
      const linkImage = req.file.filename;
      await productService.createProduct({
        name,
        description,
        color,
        size,
        linkImage,
        price,
        quantity,
      });
      res.status(200).json({
        success: true,
        message: "successfully created",
      });
    } catch (error) {
      console.log(error);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      let { name, description, color, size, linkImage, price, quantity } =
        req.body;
      const productID = req.params.productID;

      // remove old file
      if (fs.existsSync(`./src/uploads/${linkImage}`)) {
        fs.unlinkSync(`./src/uploads/${linkImage}`);
      }
      // update new file if exist
      if (req.file) {
        linkImage = req.file.filename;
      }
      await productService.updateProduct({
        productID,
        name,
        description,
        color,
        size,
        linkImage,
        price,
        quantity,
      });
      res.status(200).json({
        success: true,
        message: "successfully updated",
      });
    } catch (error) {
      console.log(error);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const productID = req.params.productID;
      const product = await productService.getProductByProductID(productID);
      if (product.length === 0) {
        return res.status(400).json({
          success: false,
          message: "not found product to remove",
        });
      }
      // remove image
      fs.unlinkSync(`./src/uploads/${product[0].linkImage}`);

      await productService.deleteProduct(productID);

      res.status(200).json({
        success: true,
        message: "successfully deleted",
      });
    } catch (error) {
      console.log(error);
    }
  },
};
