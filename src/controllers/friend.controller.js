const Friend = require("../models/Friend");
const User = require("../models/User");
const TokenOneSignal = require("../models/TokenOneSignal");
const mongoose = require("mongoose");
const _ = require("lodash");
var response = require("../models/ResponseModel").response;
const {
  SendNotification,
  SendNotificationToDevice,
} = require("../utils/send-notification");

class FriendController {
  // /friends/has-been-requested
  async pendingFriend(req, res) {
    const userId = res.locals.payload.id;
    try {
      const friends = await Friend.find({
        requester_id: new mongoose.Types.ObjectId(userId),
        status: 2,
      })
        .lean()
        .populate("recipient_id", "_id avatar_path full_name bio");
      return res.json(response(true, friends));
    } catch (error) {
      console.log(error);
      return res.status(503).json({ status: false });
    }
  }
  //[GET] /friends/requested/
  async requestedAddFriend(req, res) {
    const userId = res.locals.payload.id;
    try {
      const friends = await User.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "friends",
            localField: "friends",
            foreignField: "_id",
            as: "friends",
          },
        },
        {
          $unwind: "$friends",
        },
        {
          $match: {
            "friends.status": 1,
          },
        },
        {
          $group: {
            _id: "$_id",
            phone: { $first: "$phone" },
            friends: { $push: "$friends" },
          },
        },
      ]);
      return res.json(friends);
    } catch (error) {
      console.log(error);
      return res.status(503).json("Loi server");
    }
  }
  //[POST] /friends/send-request/:id
  async requestAddFriend(req, res) {
    const data = {
      userA: res.locals.payload.id,
      userB: req.body.userB,
    };
    try {
      const docA = await Friend.findOneAndUpdate(
        {
          requester_id: data.userA,
          recipient_id: data.userB,
        },
        { $set: { status: 1 } },
        { upsert: true, new: true }
      );
      const docB = await Friend.findOneAndUpdate(
        {
          recipient_id: data.userA,
          requester_id: data.userB,
        },
        { $set: { status: 2 } },
        { upsert: true, new: true }
      );
      //update user A
      await User.findOneAndUpdate(
        {
          _id: data.userA,
        },
        { $push: { friends: docA._id } }
      );
      //update user B
      await User.findOneAndUpdate(
        {
          _id: data.userB,
        },
        { $push: { friends: docB._id } }
      );
      let listToken = await TokenOneSignal.find({
        user: new mongoose.Types.ObjectId(data.userB),
      });

      const userA2 = await User.findById(data.userA);
      const userB2 = await User.findById(data.userB);
      listToken = listToken.map((x) => x.token_signal);
      console.log(listToken);
      SendNotificationToDevice(
        listToken,
        `${res.locals.userName} vừa gửi lời mời kết bạn`,
        [userB2._id],
        userA2._id,
        (error, results) => {
          if (error) {
            console.log(err);
          }
          console.log(results);
        }
      );
      return res.status(200).json({ status: true });
    } catch (error) {
      console.log(error);
      return res.status(503).json({ status: false });
    }
  }

  //[POST] /friends/accept-friend/:id
  async acceptAddFriend(req, res) {
    const data = {
      userA: res.locals.payload.id,
      userB: req.body.userB,
    };
    try {
      await Friend.findOneAndUpdate(
        { requester_id: data.userA, recipient_id: data.userB },
        { $set: { status: 3 } }
      );
      await Friend.findOneAndUpdate(
        { recipient_id: data.userA, requester_id: data.userB },
        { $set: { status: 3 } }
      );
      const userA2 = await User.findById(data.userA);
      const userB2 = await User.findById(data.userB);
      let listToken = await TokenOneSignal.find({
        user: new mongoose.Types.ObjectId(data.userB),
      });
      listToken = listToken.map((x) => x.token_signal);
      console.log(listToken);
      SendNotificationToDevice(
        listToken,
        `${userA2.full_name} đã châp nhận lời mời kết bạn`,
        [userA2._id],
        userB2._id,
        (error, results) => {
          if (error) {
            console.log(err);
          }
          console.log(results);
        }
      );
      return res.status(200).json({ status: true });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false });
    }
  }

  // POST /friends/deny-friend
  async denyAddFriendOrUnfriend(req, res) {
    const data = {
      userA: res.locals.payload.id,
      userB: req.body.userB,
    };
    try {
      await Friend.findOneAndRemove({
        requester_id: data.userA,
        recipient_id: data.userB,
      });
      await Friend.findOneAndRemove({
        recipient_id: data.userA,
        requester_id: data.userB,
      });
      return res.status(200).json({ status: true });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false });
    }
  }
  // Get list friends
  listFriend = async (req, res) => {
    const userId = res.locals.payload.id;

    try {
      const friends = await Friend.find({
        requester_id: new mongoose.Types.ObjectId(userId),
        status: 3,
      })
        .lean()
        .select("recipient_id")
        .populate("recipient_id", "_id avatar_path full_name bio");
      return res.status(200).json(response(true, friends));
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false });
    }
  };
}

module.exports = new FriendController();
