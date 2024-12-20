import {
  getVariations,
  upsertVariation,
  deleteVariationByVariationID
} from "../services/variations.service.js";
import Response from "../configs/response.js";
import { Message, StatusCode } from "../utils/constants.js";

export const handleGetVariations = async (req, res, next) => {
  try {
    const data = await getVariations();
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
};

export const handleUpsertVariation = async (req, res, next) => {
  try {
    const { variationID, nameAtribute } = req.body;

    const newVariation = await upsertVariation({
      variationID,
      nameAtribute
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
};

export const handleDeleteVariation = async (req, res, next) => {
  try {
    const { variationID } = req.params;
    await deleteVariationByVariationID(variationID);
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
};
