import categoryService from "../services/categories.service.js";
import Response from "../configs/response.js";
import { Message, StatusCode } from "../utils/constants.js";

export const getCategories = async (req, res, next) => {
  try {
    const data = await categoryService.getCategories();
    return Response.success(
      res,
      Message.SUCCESS_GET_CATEGORIES,
      data,
      StatusCode.OK
    );
  } catch (error) {
    console.error("Error in getCategories controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const upsertCategory = async (req, res, next) => {
  try {
    const { categoryID, parentCategoryID, name } = req.body;

    await categoryService.upsertCategory({
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
    console.error("Error in upsertCategory controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { categoryID } = req.params;
    await categoryService.deleteCategory(categoryID);
    return Response.success(
      res,
      Message.SUCCESS_DELETE_CATEGORY,
      null,
      StatusCode.OK
    );
  } catch (error) {
    console.error("Error in deleteCategory controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};
