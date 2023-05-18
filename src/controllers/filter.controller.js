const User = require("../models/User");
const _ = require("lodash");
const mongoose = require("mongoose");
var response = require("../models/ResponseModel").response;

class FilterController {
  searchUser = async (req, res) => {
    const foundUser = await User.find();
    const result = foundUser.map((x) =>
      _.pick(x, ["_id", "phone", "full_name", "avatar_path", "bio"])
    );
    return res.status(200).json(response(true, result));
  };
}

module.exports = new FilterController();
