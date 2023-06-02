const jwt = require("jsonwebtoken");
const _ = require("lodash");
const User = require("../models/User");
const { response } = require("../models/ResponseModel");

const checkToken = async (req, res, next) => {
  try {
    const payload = jwt.verify(
      req.header("authorization"),
      process.env.JWT_SECRET
    );
    res.locals.payload = payload;
    const user = await User.findById(payload.id);
    res.locals.userName = user.full_name;
    console.log(payload);
    next();
  } catch (error) {
    return res.status(401).json(response(false, _.pick(error, "message")));
  }
};

module.exports = { checkToken };
