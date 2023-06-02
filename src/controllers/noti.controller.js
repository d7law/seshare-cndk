const Noti = require("../models/Notification");
const LikePostOfUser = require("../models/LikePostOfUser");
const Comments = require("../models/Comment");
const Friend = require("../models/Friend");
const TokenOneSignal = require("../models/TokenOneSignal");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { makeRandom } = require("../utils/format-text");
const { countTimes, formatTimeUpload } = require("../utils/format-date");
const {
  SendNotification,
  SendNotificationToDevice,
} = require("../utils/send-notification");
const { $where } = require("../models/User");
const { default: mongoose } = require("mongoose");
var response = require("../models/ResponseModel").response;

class NotiController {
  getUserNoti = async (req, res) => {
    const listNoti = await Noti.find({
      own_user: { $in: new mongoose.Types.ObjectId(res.locals.payload.id) },
    })
      .lean()
      .populate("own_user", "avatar_path full_name")
      .populate("who_user", "avatar_path full_name");

    return res.status(200).json(response(true, listNoti));
  };
}

module.exports = new NotiController();
