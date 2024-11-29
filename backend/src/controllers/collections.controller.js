const collectionService = require("../services/collections.service");
module.exports = {
  getCollections: async (req, res, next) => {
    try {
      const { page, size } = req.query;
      const offset = page * size;
      const data = await collectionService.getCollectionsByOffsetBased(
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
  getCollection: async (req, res, next) => {
    try {
      const { collectionID } = req.params;
      const data = await collectionService.getCollectionByCollectionID(
        collectionID
      );
      res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
    }
  },
  createCollection: async (req, res, next) => {
    try {
      const { name } = req.body;
      // check exist
      const existCollection = await collectionService.getCollectionByName(name);
      if (existCollection.length !== 0) {
        return res
          .status(400)
          .json({ success: false, error: "duplicate name" });
      }
      await collectionService.createCollection({ name });
      res.status(200).json({ success: true, message: "successfully create" });
    } catch (error) {
      console.log(error);
    }
  },
  updateCollection: async (req, res, next) => {
    try {
      const { name, productIDs } = req.body;
      const collectionID = req.params.collectionID;

      await collectionService.updateCollection({
        collectionID,
        name,
        productIDs,
      });
      return res.status(200).json({
        success: true,
        message: "successfully updated",
      });
    } catch (error) {
      console.log(error);
    }
  },

  deleteCollection: async (req, res, next) => {
    try {
      const collectionID = req.params.collectionID;
      await collectionService.deleteCollection(collectionID);
      res.status(200).json({
        success: true,
        message: "successfully deleted",
      });
    } catch (error) {
      console.log(error);
    }
  },
};
