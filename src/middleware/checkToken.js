const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { response } = require("../models/ResponseModel");

const checkToken = async (req, res, next) => {
  try {
    const payload = jwt.verify(
      req.header("authorization"),
      process.env.JWT_SECRET
    );
    res.locals.payload = payload;
    console.log(payload);
    next();
  } catch (error) {
    return res.status(401).json(response(false, _.pick(error, "message")));
  }
};

module.exports = { checkToken };
