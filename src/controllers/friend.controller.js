const Friend = require("../models/Friend");
const User = require("../models/User");
const mongoose = require("mongoose");
var response = require("../models/ResponseModel").response;

class FriendController {
  //[GET] /friends/requested/:id
  async requestedAddFriend(req, res) {
    try {
      const friends = await User.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.params.id),
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
      userA: req.params.id,
      userB: req.body.userB,
    };
    try {
      const docA = await Friend.findOneAndUpdate(
        {
          requester: data.userA,
          recipient: data.userB,
        },
        { $set: { status: 1 } },
        { upsert: true, new: true }
      );
      const docB = await Friend.findOneAndUpdate(
        {
          recipient: data.userA,
          requester: data.userB,
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
      return res.status(200).json("Gui yeu cau thanh cong");
    } catch (error) {
      return res.status(503).json("Loi server");
    }
  }

  //[POST] /friends/accept-friend/:id
  async acceptAddFriend(req, res) {
    const data = {
      userA: req.params.id,
      userB: req.body.userB,
    };

    await Friend.findOneAndUpdate(
      { requester: data.userA, recipient: data.userB },
      { $set: { status: 3 } }
    );
    await Friend.findOneAndUpdate(
      { recipient: data.userA, requester: data.userB },
      { $set: { status: 3 } }
    );
  }
}

module.exports = new FriendController();
