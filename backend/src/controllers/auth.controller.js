const userService = require("../services/users.service");
module.exports = {
  login: async (req, res, next) => {
    const { username, email, password, role } = req.body;

    const user = await userService.getUserByEmail(email);
    if (user.length === 0 || user[0].password !== password) {
      return res
        .status(400)
        .json({ success: false, error: "Email or password is incorrect" });
    }

    req.session.userID = user[0].userID;
    req.session.role = user[0].role;
    console.log(req.sessionID);
    return res.status(200).json({ success: true, data: user });
  },
  register: async (req, res, next) => {
    try {
      const { username, email, password, role } = req.body;

      const user = await userService.getUserByEmail(email);
      if (user.length !== 0) {
        return res
          .status(400)
          .json({ success: false, error: "Email is already register" });
      }
      const newData = await userService.createUser({
        username,
        email,
        password,
        role: "client",
      });

      req.session.userID = newData[0].userID;
      req.session.role = newData[0].role;

      return res.status(201).json({
        success: true,
        data: newData,
      });
    } catch (error) {
      console.log(error);
    }
  },
  check: async (req, res, next) => {
    console.log(req.sessionID);
    return res.status(200).json({
      success: true,
      userID: req.session.userID,
      role: req.session.role,
    });
  },
};
