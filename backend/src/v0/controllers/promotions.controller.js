const promotionService = require("../services/promotions.service");
const Response = require("../configs/response");
const { Message, StatusCode } = require("../utils/constants");

module.exports = {
  getPromotions: async (req, res, next) => {
    try {
      const data = await promotionService.getPromotions();
      return Response.success(
        res,
        Message.SUCCESS_GET_PROMOTIONS,
        data,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in getPromotions controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },

  upsertPromotion: async (req, res, next) => {
    try {
      const { promotionID, name, discount, startDate, endDate } = req.body;

      await promotionService.upsertPromotion({
        promotionID,
        name,
        discount,
        startDate,
        endDate,
      });
      return Response.success(
        res,
        Message.SUCCESS_UPDATE_PROMOTION,
        null,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in upsertPromotion controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },

  deletePromotion: async (req, res, next) => {
    try {
      const { promotionID } = req.params;
      await promotionService.deletePromotion(promotionID);
      return Response.success(
        res,
        Message.SUCCESS_DELETE_PROMOTION,
        null,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in deletePromotion controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },
};
