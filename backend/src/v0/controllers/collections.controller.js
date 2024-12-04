const collectionService = require("../services/collections.service");
const Response = require("../configs/response");
const { Message, StatusCode } = require("../utils/constants");

module.exports = {
  getCollections: async (req, res, next) => {
    const { page, size } = req.query;
    const offset = page * size;
    const data = await collectionService.getCollectionsByOffsetBased(offset, size);
    return Response.success(res, Message.SUCCESS_GET_COLLECTIONS, data, StatusCode.OK);
  },

  getCollection: async (req, res, next) => {
    const { collectionID } = req.params;
    const data = await collectionService.getCollectionByCollectionID(collectionID);
    if (!data || data.length === 0) {
      return Response.error(res, Message.ERROR_COLLECTION_NOT_FOUND, null, StatusCode.NOT_FOUND);
    }
    return Response.success(res, Message.SUCCESS_GET_COLLECTION, data, StatusCode.OK);
  },

  createCollection: async (req, res, next) => {
    const { name } = req.body;
    const existCollection = await collectionService.getCollectionByName(name);
    
    if (existCollection.length !== 0) {
      return Response.error(res, Message.ERROR_COLLECTION_NAME_EXISTS, null, StatusCode.CONFLICT);
    }
    
    await collectionService.createCollection({ name });
    return Response.success(res, Message.SUCCESS_CREATE_COLLECTION, null, StatusCode.CREATED);
  },

  updateCollection: async (req, res, next) => {
    const { name, productIDs } = req.body;
    const { collectionID } = req.params;

    const collection = await collectionService.getCollectionByCollectionID(collectionID);
    if (!collection || collection.length === 0) {
      return Response.error(res, Message.ERROR_COLLECTION_NOT_FOUND, null, StatusCode.NOT_FOUND);
    }

    await collectionService.updateCollection({
      collectionID,
      name,
      productIDs,
    });
    return Response.success(res, Message.SUCCESS_UPDATE_COLLECTION, null, StatusCode.OK);
  },

  deleteCollection: async (req, res, next) => {
    const { collectionID } = req.params;
    const collection = await collectionService.getCollectionByCollectionID(collectionID);
    if (!collection || collection.length === 0) {
      return Response.error(res, Message.ERROR_COLLECTION_NOT_FOUND, null, StatusCode.NOT_FOUND);
    }
    await collectionService.deleteCollection(collectionID);
    return Response.success(res, Message.SUCCESS_DELETE_COLLECTION, null, StatusCode.OK);
  },
};
