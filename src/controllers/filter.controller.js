const User = require("../models/User");
const Photo = require("../models/Photo");
const _ = require("lodash");
const mongoose = require("mongoose");
var response = require("../models/ResponseModel").response;

class FilterController {
  populateUserAndPhoto = async (req, res) => {
    let photos = await Photo.find({
      $or: [{ privacy: "public" }, { privacy: "friends" }],
    });
    if (!photos) return res.status(404).json({ status: false });

    photos = _.shuffle(photos);
    return res
      .status(200)
      .json(response(true, _.flatMap(photos, "photo_path")));
  };

  searchUser = async (req, res) => {
    const foundUser = await User.find();
    const result = foundUser.map((x) =>
      _.pick(x, ["_id", "phone", "full_name", "avatar_path", "bio"])
    );
    return res.status(200).json(response(true, result));
  };
}

module.exports = new FilterController();
