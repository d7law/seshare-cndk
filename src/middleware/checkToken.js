const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  console.log(req.header("authorization"));
  next();
};

module.exports = { checkToken };
