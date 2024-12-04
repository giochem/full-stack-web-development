const userService = require("../services/users.service");
const Response = require("../configs/response");
const { Message, StatusCode } = require("../utils/constants");

module.exports = {
  login: async (req, res, next) => {
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
  },
  getProfile: async (req, res, next) => {
    const user = await userService.getUserByUserID(req.session.userID);
    return Response.success(res, Message.SUCCESS_LOGIN, user, StatusCode.OK);
  },

  register: async (req, res, next) => {
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
  },

  check: async (req, res, next) => {
    if (!req.session.userID) {
      return Response.error(
        res,
        Message.ERROR_UNAUTHORIZED,
        null,
        StatusCode.UNAUTHORIZED
      );
    }
    return Response.success(
      res,
      Message.SUCCESS_LOGIN,
      {
        userID: req.session.userID,
        role: req.session.role,
      },
      StatusCode.OK
    );
  },
};
