const variationService = require("../services/variations.service");
const Response = require("../configs/response");
const { Message, StatusCode } = require("../utils/constants");

module.exports = {
  getVariations: async (req, res, next) => {
    try {
      const data = await variationService.getVariations();
      return Response.success(
        res,
        Message.SUCCESS_GET_VARIATIONS,
        data,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in getVariations controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },

  upsertVariation: async (req, res, next) => {
    try {
      const { variationID, nameAtribute } = req.body;

      const newVariation = await variationService.upsertVariation({
        variationID,
        nameAtribute,
      });
      return Response.success(
        res,
        Message.SUCCESS_CREATE_VARIATION,
        newVariation,
        StatusCode.CREATED
      );
    } catch (error) {
      console.error("Error in upsertVariation controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },

  deleteVariation: async (req, res, next) => {
    try {
      const { variationID } = req.params;
      await variationService.deleteVariationByVariationID(variationID);
      return Response.success(
        res,
        Message.SUCCESS_DELETE_VARIATION,
        null,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in deleteVariation controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },
};
