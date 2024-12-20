import {
  getCategories,
  upsertCategory,
  removeCategoryById
} from "../services/categories.service.js";
import Response from "../configs/response.js";
import { Message, StatusCode } from "../utils/constants.js";

export const handleGetCategories = async (req, res, next) => {
  try {
    const data = await getCategories();
    return Response.success(
      res,
      Message.SUCCESS_GET_CATEGORIES,
      data,
      StatusCode.OK
    );
  } catch (error) {
    console.error("Error in handleGetCategories controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const handleUpsertCategory = async (req, res, next) => {
  try {
    const { categoryID, parentCategoryID, name } = req.body;

    await upsertCategory({
      categoryID,
      parentCategoryID,
      name
    });
    return Response.success(
      res,
      Message.SUCCESS_UPDATE_CATEGORY,
      null,
      StatusCode.OK
    );
  } catch (error) {
    console.error("Error in handleUpsertCategory controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const handleDeleteCategory = async (req, res, next) => {
  try {
    const { categoryID } = req.params;
    await removeCategoryById(categoryID);
    return Response.success(
      res,
      Message.SUCCESS_DELETE_CATEGORY,
      null,
      StatusCode.OK
    );
  } catch (error) {
    console.error("Error in handleDeleteCategory controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};
