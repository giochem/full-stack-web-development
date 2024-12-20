import userService from "../services/users.service.js";
import sha256 from "hash.js/lib/hash/sha/256.js";
import Response from "../configs/response.js";
import { Message, StatusCode } from "../utils/constants.js";

export const getUsers = async (req, res, next) => {
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
      filterRole
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
};

export const getUser = async (req, res, next) => {
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
};

export const createUser = async (req, res, next) => {
  try {
    let { username, email, password, role } = req.body;
    const user = await userService.getUserByEmail(email);
    if (user.length !== 0) {
      return Response.error(
        res,
        Message.ERROR_EMAIL_EXISTS,
        null,
        StatusCode.CONFLICT
      );
    }
    password = sha256().update(password).digest("hex").toString();
    const newUser = await userService.createUser({
      username,
      email,
      password,
      role
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
};

export const updateUser = async (req, res, next) => {
  try {
    let { username, email, password, role } = req.body;
    const { userID } = req.params;
    password = sha256().update(password).digest("hex").toString();
    await userService.updateUser({
      userID,
      username,
      email,
      password,
      role
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
};

export const deleteUser = async (req, res, next) => {
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
};
