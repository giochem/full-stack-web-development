import {
  getUserByEmail,
  getUserByUserID,
  createUser
} from "../services/users.service.js";
import Response from "../configs/response.js";
import { Message, StatusCode } from "../utils/constants.js";
import hash from "hash.js";

export const handleLogin = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    const user = await getUserByEmail(email);
    password = hash.sha256().update(password).digest("hex");
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
    console.error("Error in handleLogin controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const handleGetProfile = async (req, res, next) => {
  try {
    const user = await getUserByUserID(req.session.userID);
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
    console.error("Error in handleGetProfile controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const handleRegister = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const user = await getUserByEmail(email);

    if (user.length !== 0) {
      return Response.error(
        res,
        Message.ERROR_EMAIL_EXISTS,
        null,
        StatusCode.CONFLICT
      );
    }
    password = hash.sha256().update(password).digest("hex");
    const newData = await createUser({
      username,
      email,
      password,
      role: "client"
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
    console.error("Error in handleRegister controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const handleLogout = async (req, res, next) => {
  req.session.destroy();
  return Response.success(res, Message.SUCCESS_LOGOUT, null, StatusCode.OK);
};
