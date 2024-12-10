const categoryService = require("../services/categories.service");
const Response = require("../configs/response");
const { Message, StatusCode } = require("../utils/constants");

module.exports = {
  getCategories: async (req, res, next) => {
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
  },

  upsertCategory: async (req, res, next) => {
    try {
      const { categoryID, parentCategoryID, name } = req.body;

      await categoryService.upsertCategory({
        categoryID,
        parentCategoryID,
        name,
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
  },

  deleteCategory: async (req, res, next) => {
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
  },
};
