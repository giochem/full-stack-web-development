const productService = require("../services/products.service");
const Response = require("../configs/response");
const { Message, StatusCode, Path } = require("../utils/constants");
const fs = require("fs");

module.exports = {
  getProducts: async (req, res, next) => {
    try {
      // ->promotion, category,number in cart, order
      const {
        page,
        size,
        sortBy,
        sortOrder,
        searchText,
        filterPromotion,
        filterCategory,
      } = req.query;
      const offset = page * size;
      const data = await productService.getProductsByOffsetBased(
        offset,
        size,
        sortBy,
        sortOrder,
        searchText,
        filterPromotion, // promotionID
        filterCategory // categoryID
      );
      return Response.success(
        res,
        Message.SUCCESS_GET_PRODUCTS,
        data,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in getProducts controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },

  getProduct: async (req, res, next) => {
    try {
      const { productID } = req.params;
      const data = await productService.getProductByProductID(productID);
      if (!data || data.length === 0) {
        return Response.error(
          res,
          Message.ERROR_PRODUCT_NOT_FOUND,
          null,
          StatusCode.NOT_FOUND
        );
      }
      return Response.success(
        res,
        Message.SUCCESS_GET_PRODUCT,
        data,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in getProduct controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },

  createProduct: async (req, res, next) => {
    try {
      const { name, description, promotionID, categoryID } = req.body;

      if (!req.file) {
        return Response.error(
          res,
          Message.ERROR_PRODUCT_IMAGE_REQUIRED,
          null,
          StatusCode.BAD_REQUEST
        );
      }

      const image = req.file.filename;
      const newProduct = await productService.createProduct({
        promotionID,
        categoryID,
        name,
        description,
        image,
      });
      return Response.success(
        res,
        Message.SUCCESS_CREATE_PRODUCT,
        newProduct,
        StatusCode.CREATED
      );
    } catch (error) {
      console.error("Error in createProduct controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },
  createProductItem: async (req, res, next) => {
    try {
      const { productID, productList } = req.body;

      const newProductItem = await productService.createProductItem({
        productID,
        productList,
      });
      return Response.success(
        res,
        Message.SUCCESS_CREATE_PRODUCT_ITEM,
        newProductItem,
        StatusCode.CREATED
      );
    } catch (error) {
      console.error("Error in createProductItem controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      let { name, description, promotionID, categoryID } = req.body;
      const { productID } = req.params;

      const product = await productService.getProductByProductID(productID);
      if (!product || product.length === 0) {
        return Response.error(
          res,
          Message.ERROR_PRODUCT_NOT_FOUND,
          null,
          StatusCode.NOT_FOUND
        );
      }

      if (image && fs.existsSync(`${Path.UPLOAD_DIR}/${image}`)) {
        fs.unlinkSync(`${Path.UPLOAD_DIR}/${image}`);
      }

      if (req.file) {
        image = req.file.filename;
      }

      await productService.updateProduct({
        productID,
        promotionID,
        categoryID,
        name,
        description,
        image,
      });
      return Response.success(
        res,
        Message.SUCCESS_UPDATE_PRODUCT,
        null,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in updateProduct controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const { productID } = req.params;
      const product = await productService.getProductByProductID(productID);

      if (!product || product.length === 0) {
        return Response.error(
          res,
          Message.ERROR_PRODUCT_NOT_FOUND,
          null,
          StatusCode.NOT_FOUND
        );
      }

      if (
        product[0].image &&
        fs.existsSync(`${Path.UPLOAD_DIR}/${product[0].image}`)
      ) {
        fs.unlinkSync(`${Path.UPLOAD_DIR}/${product[0].linkImage}`);
      }

      await productService.deleteProduct(productID);
      return Response.success(
        res,
        Message.SUCCESS_DELETE_PRODUCT,
        null,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in deleteProduct controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },
};
