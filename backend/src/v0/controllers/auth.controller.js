const userService = require("../services/users.service");
const Response = require("../configs/response");
const { Message, StatusCode } = require("../utils/constants");

module.exports = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await userService.getUserByEmail(email);

      if (user.length === 0 || user[0].password !== password) {
        return Response.error(
          res,
          Message.ERROR_INVALID_CREDENTIALS,
          null,
          StatusCode.UNAUTHORIZED
        );
      }
      req.session.userID = user[0].userID;
      req.session.role = user[0].role;
      return Response.success(res, Message.SUCCESS_LOGIN, user, StatusCode.OK);
    } catch (error) {
      console.error("Error in login controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },

  getProfile: async (req, res, next) => {
    try {
      const user = await userService.getUserByUserID(req.session.userID);
      if (!user || user.length === 0) {
        return Response.error(
          res,
          Message.ERROR_USER_NOT_FOUND,
          null,
          StatusCode.NOT_FOUND
        );
      }
      return Response.success(res, Message.SUCCESS_LOGIN, user, StatusCode.OK);
    } catch (error) {
      console.error("Error in getProfile controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },

  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = await userService.getUserByEmail(email);

      if (user.length !== 0) {
        return Response.error(
          res,
          Message.ERROR_EMAIL_EXISTS,
          null,
          StatusCode.CONFLICT
        );
      }

      const newData = await userService.createUser({
        username,
        email,
        password,
        role: "client",
      });

      req.session.userID = newData[0].userID;
      req.session.role = newData[0].role;

      return Response.success(
        res,
        Message.SUCCESS_REGISTER,
        newData,
        StatusCode.CREATED
      );
    } catch (error) {
      console.error("Error in register controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },
};
