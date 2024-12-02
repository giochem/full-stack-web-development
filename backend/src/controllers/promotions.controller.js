const promotionService = require("../services/promotions.service");
const Response = require("../configs/response");
const { Message, StatusCode } = require("../utils/constants");

module.exports = {
  getPromotions: async (req, res, next) => {
    const { page, size } = req.query;
    const offset = page * size;
    const data = await promotionService.getPromotionsByOffsetBased(offset, size);
    return Response.success(res, Message.SUCCESS_GET_PROMOTIONS, data, StatusCode.OK);
  },

  getPromotion: async (req, res, next) => {
    const { promotionID } = req.params;
    const data = await promotionService.getPromotionByPromotionID(promotionID);
    if (!data || data.length === 0) {
      return Response.error(res, Message.ERROR_PROMOTION_NOT_FOUND, null, StatusCode.NOT_FOUND);
    }
    return Response.success(res, Message.SUCCESS_GET_PROMOTION, data, StatusCode.OK);
  },

  createPromotion: async (req, res, next) => {
    const { name, reduce, startTime, endTime } = req.body;
    const existPromotion = await promotionService.getPromotionByName(name);
    
    if (existPromotion.length !== 0) {
      return Response.error(res, Message.ERROR_PROMOTION_NAME_EXISTS, null, StatusCode.CONFLICT);
    }

    const newPromotion = await promotionService.createPromotion({
      name,
      reduce,
      startTime,
      endTime,
    });
    return Response.success(res, Message.SUCCESS_CREATE_PROMOTION, newPromotion, StatusCode.CREATED);
  },

  updatePromotion: async (req, res, next) => {
    const { name, reduce, startTime, endTime, productIDs } = req.body;
    const { promotionID } = req.params;

    const promotion = await promotionService.getPromotionByPromotionID(promotionID);
    if (!promotion || promotion.length === 0) {
      return Response.error(res, Message.ERROR_PROMOTION_NOT_FOUND, null, StatusCode.NOT_FOUND);
    }

    await promotionService.updatePromotion({
      promotionID,
      name,
      reduce,
      startTime,
      endTime,
      productIDs,
    });
    return Response.success(res, Message.SUCCESS_UPDATE_PROMOTION, null, StatusCode.OK);
  },

  deletePromotion: async (req, res, next) => {
    const { promotionID } = req.params;
    const promotion = await promotionService.getPromotionByPromotionID(promotionID);
    if (!promotion || promotion.length === 0) {
      return Response.error(res, Message.ERROR_PROMOTION_NOT_FOUND, null, StatusCode.NOT_FOUND);
    }
    await promotionService.deletePromotion(promotionID);
    return Response.success(res, Message.SUCCESS_DELETE_PROMOTION, null, StatusCode.OK);
  },
};
