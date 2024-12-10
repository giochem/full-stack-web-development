const productService = require("../services/products.service");
const Response = require("../configs/response");
const { Message, StatusCode, Path } = require("../utils/constants");
const { randomUUID } = require("crypto");
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
  getProductExtraInfo: async (req, res, next) => {
    try {
      const data = await productService.getProductExtraInfo();
      return Response.success(
        res,
        Message.SUCCESS_GET_PRODUCT_EXTRA_INFO,
        data,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in getProductExtraInfo controller:", error);
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

  upsertProduct: async (req, res, next) => {
    try {
      let { productID, promotionID, categoryID, name, description, image } =
        req.body;
      if (req.file?.filename) {
        image = req.file.filename;
      }
      await productService.upsertProduct({
        productID,
        promotionID,
        categoryID,
        name,
        description,
        image,
      });
      return Response.success(
        res,
        Message.SUCCESS_UPSERT_PRODUCT,
        null,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in createProduct controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },
  upsertProductItem: async (req, res, next) => {
    try {
      let {
        productID,
        productItemID,
        sku,
        price,
        quantity,
        image,
        variationOptionList,
      } = req.body;
      if (req.file?.filename) {
        image = req.file.filename;
      }
      await productService.upsertProductItem({
        productID,
        productItemID,
        sku,
        price,
        quantity,
        image,
        variationOptionList: JSON.parse(variationOptionList),
      });
      return Response.success(
        res,
        Message.SUCCESS_UPSERT_PRODUCT_ITEM,
        null,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in upsertProductItem controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const { productID, productItemID } = req.query;
      if (productID) {
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
      } else if (productItemID) {
        const productItem = await productService.getProductItemByProductItemID(
          productItemID
        );

        if (!productItem || productItem.length === 0) {
          return Response.error(
            res,
            Message.ERROR_PRODUCT_ITEM_NOT_FOUND,
            null,
            StatusCode.NOT_FOUND
          );
        }
        if (
          productItem[0].image &&
          fs.existsSync(`${Path.UPLOAD_DIR}/${productItem[0].image}`)
        ) {
          fs.unlinkSync(`${Path.UPLOAD_DIR}/${productItem[0].linkImage}`);
        }

        await productService.deleteProductItem(productItemID);
        return Response.success(
          res,
          Message.SUCCESS_DELETE_PRODUCT_ITEM,
          null,
          StatusCode.OK
        );
      } else {
        return Response.error(
          res,
          Message.ERROR_INVALID_QUERY,
          null,
          StatusCode.BAD_REQUEST
        );
      }
    } catch (error) {
      console.error("Error in deleteProduct controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },
};
