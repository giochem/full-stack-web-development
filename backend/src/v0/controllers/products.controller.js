import {
  getProductsByOffsetBased,
  getProductExtraInfo,
  getProductByProductID,
  upsertProduct,
  upsertProductItem,
  getProductItemByProductItemID,
  deleteProduct,
  deleteProductItem
} from "../services/products.service.js";
import Response from "../configs/response.js";
import { Message, StatusCode, Path } from "../utils/constants.js";
import fs from "fs";

export const handleGetProducts = async (req, res, next) => {
  try {
    const {
      page,
      size,
      sortBy,
      sortOrder,
      searchText,
      filterPromotion,
      filterCategory
    } = req.query;
    const offset = page * size;
    const data = await getProductsByOffsetBased(
      offset,
      size,
      sortBy,
      sortOrder,
      searchText,
      filterPromotion,
      filterCategory
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
};

export const handleGetProductExtraInfo = async (req, res, next) => {
  try {
    const data = await getProductExtraInfo();
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
};

export const handleGetProduct = async (req, res, next) => {
  try {
    const { productID } = req.params;
    const data = await getProductByProductID(productID);
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
};

export const handleUpsertProduct = async (req, res, next) => {
  try {
    let { productID, promotionID, categoryID, name, description, image } =
      req.body;
    if (req.file?.filename) {
      image = req.file.filename;
    }
    await upsertProduct({
      productID,
      promotionID,
      categoryID,
      name,
      description,
      image
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
};

export const handleUpsertProductItem = async (req, res, next) => {
  try {
    let {
      productID,
      productItemID,
      sku,
      price,
      quantity,
      image,
      variationOptionList
    } = req.body;
    if (req.file?.filename) {
      image = req.file.filename;
    }
    await upsertProductItem({
      productID,
      productItemID,
      sku,
      price,
      quantity,
      image,
      variationOptionList: JSON.parse(variationOptionList)
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
};

export const handleDeleteProduct = async (req, res, next) => {
  try {
    const { productID, productItemID } = req.query;
    if (productID) {
      const product = await getProductByProductID(productID);

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

      await deleteProduct(productID);
      return Response.success(
        res,
        Message.SUCCESS_DELETE_PRODUCT,
        null,
        StatusCode.OK
      );
    } else if (productItemID) {
      const productItem = await getProductItemByProductItemID(productItemID);

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

      await deleteProductItem(productItemID);
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
};
