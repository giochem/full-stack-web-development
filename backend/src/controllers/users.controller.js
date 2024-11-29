const userService = require("../services/users.service");
const { validationResult } = require("express-validator");

module.exports = {
  getUsers: async (req, res, next) => {
    try {
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return res.status(400).json({
      //     success: false,
      //     errors: errors.array(),
      //   });
      // }
      const { page, size } = req.query;
      // offset-based
      const offset = page * size;
      const data = await userService.getUsersByOffsetBased(offset, size);
      // keyset-based
      // const data = await userService.getUsersByKeysetBased(lastID, limit);
      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
    }
  },
  getUser: async (req, res, next) => {
    try {
      const { userID } = req.params;
      const data = await userService.getUser({ userID });
      res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.log(error);
    }
  },
  createUser: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const newUser = userService.createUser({ username, email, password });
      res.status(200).json({
        success: true,
        data: newUser,
      });
    } catch (error) {
      console.log(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const userID = req.params.userID;

      await userService.updateUser({
        username,
        email,
        password,
        userID,
      });
      return res.status(200).json({
        success: true,
        message: "successfully updated",
      });
    } catch (error) {
      console.log(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const userID = req.params.userID;
      await userService.deleteUser({ userID });
      res.status(200).json({
        success: true,
        message: "successfully deleted",
      });
    } catch (error) {
      console.log(error);
    }
  },
};
