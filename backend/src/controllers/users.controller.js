const userService = require("../services/users.service");
const Response = require("../configs/response");
const { Message, StatusCode } = require("../utils/constants");

module.exports = {
  getUsers: async (req, res, next) => {
    const { page, size } = req.query;
    // offset-based
    const offset = page * size;
    const data = await userService.getUsersByOffsetBased(offset, size);
    // keyset-based
    // const data = await userService.getUsersByKeysetBased(lastID, limit);
    return Response.success(res, Message.SUCCESS_GET_USERS, data, StatusCode.OK);
  },

  getUser: async (req, res, next) => {
    const { userID } = req.params;
    const data = await userService.getUser({ userID });
    if (!data || data.length === 0) {
      return Response.error(res, Message.ERROR_USER_NOT_FOUND, null, StatusCode.NOT_FOUND);
    }
    return Response.success(res, Message.SUCCESS_GET_USER, data, StatusCode.OK);
  },

  createUser: async (req, res, next) => {
    const { username, email, password, role } = req.body;
    const user = await userService.getUserByEmail(email);
    if (user.length !== 0) {
      return Response.error(res, Message.ERROR_EMAIL_EXISTS, null, StatusCode.CONFLICT);
    }
    const newUser = await userService.createUser({
      username,
      email,
      password,
      role,
    });
    return Response.success(res, Message.SUCCESS_CREATE_USER, newUser, StatusCode.CREATED);
  },

  updateUser: async (req, res, next) => {
    const { username, email, password, role } = req.body;
    const { userID } = req.params;
    const user = await userService.getUser({ userID });
    if (!user || user.length === 0) {
      return Response.error(res, Message.ERROR_USER_NOT_FOUND, null, StatusCode.NOT_FOUND);
    }
    await userService.updateUser({
      username,
      email,
      password,
      userID,
      role,
    });
    return Response.success(res, Message.SUCCESS_UPDATE_USER, null, StatusCode.OK);
  },

  deleteUser: async (req, res, next) => {
    const { userID } = req.params;
    const user = await userService.getUser({ userID });
    if (!user || user.length === 0) {
      return Response.error(res, Message.ERROR_USER_NOT_FOUND, null, StatusCode.NOT_FOUND);
    }
    await userService.deleteUser({ userID });
    return Response.success(res, Message.SUCCESS_DELETE_USER, null, StatusCode.OK);
  },
};
