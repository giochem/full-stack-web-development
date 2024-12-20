import {
  getUsersByOffsetBased,
  getUserByUserID,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser
} from "../services/users.service.js";
import sha256 from "hash.js/lib/hash/sha/256.js";
import Response from "../configs/response.js";
import { Message, StatusCode } from "../utils/constants.js";

export const handleGetUsers = async (req, res, next) => {
  try {
    const { page, size, sortBy, sortOrder, searchText, filterRole } = req.query;
    // offset-based
    const offset = page * size;
    const data = await getUsersByOffsetBased({
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
    console.error("Error in handleGetUsers controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const handleGetUser = async (req, res, next) => {
  try {
    const data = await getUserByUserID(req.params.userID);
    if (!data || data.length === 0) {
      return Response.error(
        res,
        Message.ERROR_USER_NOT_FOUND,
        null,
        StatusCode.NOT_FOUND
      );
    }
    return Response.success(res, Message.SUCCESS_GET_USER, data, StatusCode.OK);
  } catch (error) {
    console.error("Error in handleGetUser controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const handleCreateUser = async (req, res, next) => {
  try {
    let { username, email, password, role } = req.body;
    const user = await getUserByEmail(email);
    if (user.length !== 0) {
      return Response.error(
        res,
        Message.ERROR_EMAIL_EXISTS,
        null,
        StatusCode.CONFLICT
      );
    }
    password = sha256().update(password).digest("hex").toString();
    const newUser = await createUser({
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
    console.error("Error in handleCreateUser controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const handleUpdateUser = async (req, res, next) => {
  try {
    let { username, email, password, role } = req.body;
    const { userID } = req.params;
    password = sha256().update(password).digest("hex").toString();
    await updateUser({
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
    console.error("Error in handleUpdateUser controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};

export const handleDeleteUser = async (req, res, next) => {
  try {
    const { userID } = req.params;
    await deleteUser(userID);
    return Response.success(
      res,
      Message.SUCCESS_DELETE_USER,
      null,
      StatusCode.OK
    );
  } catch (error) {
    console.error("Error in handleDeleteUser controller:", error);
    return Response.serverError(res, Message.ERROR_DB_QUERY, error);
  }
};
