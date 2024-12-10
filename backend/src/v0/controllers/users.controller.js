const userService = require("../services/users.service");
const Response = require("../configs/response");
const { Message, StatusCode } = require("../utils/constants");

module.exports = {
  getUsers: async (req, res, next) => {
    try {
      const { page, size, sortBy, sortOrder, searchText, filterRole } =
        req.query;
      // offset-based
      const offset = page * size;
      const data = await userService.getUsersByOffsetBased({
        offset,
        limit: size,
        sortBy,
        sortOrder,
        searchText,
        filterRole,
      });
      // keyset-based
      // const data = await userService.getUsersByKeysetBased(lastID, limit);
      return Response.success(
        res,
        Message.SUCCESS_GET_USERS,
        data,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in getUsers controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },

  getUser: async (req, res, next) => {
    try {
      const data = await userService.getUserByUserID(req.params.userID);
      if (!data || data.length === 0) {
        return Response.error(
          res,
          Message.ERROR_USER_NOT_FOUND,
          null,
          StatusCode.NOT_FOUND
        );
      }
      return Response.success(
        res,
        Message.SUCCESS_GET_USER,
        data,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in getUser controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },

  createUser: async (req, res, next) => {
    try {
      const { username, email, password, role } = req.body;
      const user = await userService.getUserByEmail(email);
      if (user.length !== 0) {
        return Response.error(
          res,
          Message.ERROR_EMAIL_EXISTS,
          null,
          StatusCode.CONFLICT
        );
      }
      const newUser = await userService.createUser({
        username,
        email,
        password,
        role,
      });
      return Response.success(
        res,
        Message.SUCCESS_CREATE_USER,
        newUser,
        StatusCode.CREATED
      );
    } catch (error) {
      console.error("Error in createUser controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { username, email, password, role } = req.body;
      const { userID } = req.params;

      await userService.updateUser({
        userID,
        username,
        email,
        password,
        role,
      });
      return Response.success(
        res,
        Message.SUCCESS_UPDATE_USER,
        null,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in updateUser controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const { userID } = req.params;
      await userService.deleteUser(userID);
      return Response.success(
        res,
        Message.SUCCESS_DELETE_USER,
        null,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in deleteUser controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },
};
