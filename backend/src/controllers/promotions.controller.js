const promotionService = require("../services/promotions.service");
module.exports = {
  getPromotions: async (req, res, next) => {
    try {
      const { page, size } = req.query;
      const offset = page * size;
      const data = await promotionService.getPromotionsByOffsetBased(
        offset,
        size
      );
      res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.log(error);
    }
  },
  getPromotion: async (req, res, next) => {
    try {
      const { promotionID } = req.params;
      const data = await promotionService.getPromotionByPromotionID(
        promotionID
      );
      res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
    }
  },
  createPromotion: async (req, res, next) => {
    try {
      const { name, reduce, startTime, endTime } = req.body;
      // check exist
      const existPromotion = await promotionService.getPromotionByName(name);
      if (existPromotion.length !== 0) {
        return res
          .status(400)
          .json({ success: false, error: "duplicate name" });
      }
      await promotionService.createPromotion({
        name,
        reduce,
        startTime,
        endTime,
      });
      res.status(200).json({
        success: true,
        message: "successfully created",
      });
    } catch (error) {
      console.log(error);
    }
  },
  updatePromotion: async (req, res, next) => {
    try {
      let { name, reduce, startTime, endTime, productIDs } = req.body;
      const promotionID = req.params.promotionID;

      await promotionService.updatePromotion({
        promotionID,
        name,
        reduce,
        startTime,
        endTime,
        productIDs,
      });
      res.status(200).json({
        success: true,
        message: "successfully updated",
      });
    } catch (error) {
      console.log(error);
    }
  },


  deletePromotion: async (req, res, next) => {
    try {
      const promotionID = req.params.promotionID;
      await promotionService.deletePromotion(promotionID);

      res.status(200).json({
        success: true,
        message: "successfully deleted",
      });
    } catch (error) {
      console.log(error);
    }
  },
};
