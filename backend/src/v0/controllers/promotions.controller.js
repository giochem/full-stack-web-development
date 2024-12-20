import {
  getPromotions,
  upsertPromotion,
  deletePromotion
} from "../services/promotions.service.js";
import Response from "../configs/response.js";
import { Message, StatusCode } from "../utils/constants.js";

export const handleGetPromotions = async (req, res, next) => {
  try {
    const data = await getPromotions();
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
};

export const handleUpsertPromotion = async (req, res, next) => {
  try {
    const { promotionID, name, discount, startDate, endDate } = req.body;

    await upsertPromotion({
      promotionID,
      name,
      discount,
      startDate,
      endDate
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
};

export const handleDeletePromotion = async (req, res, next) => {
  try {
    const { promotionID } = req.params;
    await deletePromotion(promotionID);
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
};
