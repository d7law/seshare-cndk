const Photo = require("../models/Photo");
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

class PhotoController {
  // DELETE all records
  deleteAllRecordsPost = async (req, res) => {
    return res.status(200).json(await Photo.deleteMany());
  };
  // DELETE record by Id
  deleteRecordByPostId = async (req, res) => {
    const result = await Photo.findByIdAndDelete(req.body.recordId);
    return res.json(result);
  };
  // DELET all comments
  deleteAllRecordsComment = async (req, res) => {
    return res.status(200).json(await Comments.deleteMany());
  };
  // Upload photo
  uploadPhoto = async (req, res) => {
    const randomText = makeRandom(5);
    let returnPath;
    fs.renameSync(
      req.file.path,
      req.file.path.replace("undefined", randomText)
    );
    returnPath = path.basename(req.file.path.replace("undefined", randomText));
    return res.status(200).json(response(true, returnPath));
  };
  // Get Home-Page-Post
  homePagePosts = async (req, res) => {
    const userId = res.locals.payload.id;
    let listPost = await Photo.find({ privacy: "public" })
      .lean()
      .populate("user_id", "avatar_path full_name")
      .sort({ uploadAt: -1 });

    //find Friends
    const listFriendsDb = await Friend.find({
      recipient_id: new mongoose.Types.ObjectId(userId),
      status: 3,
    })
      .lean()
      .select(["-_id", "requester_id"]);

    // Find 'friends' post
    //// init OR operator
    const orOperatorFriend = _.map(listFriendsDb, (x) => ({
      user_id: x.requester_id,
    }));

    const listFriendPost = await Photo.find({ privacy: "friends" })
      .or(
        orOperatorFriend.length > 0
          ? orOperatorFriend
          : [{ userId: "EMPTY_CODE" }, { userId: "EMPTY_CODE2" }]
      )
      .lean()
      .populate("user_id", "avatar_path full_name");

    //find userPost
    const listUserPost = await Photo.find({
      user_id: new mongoose.Types.ObjectId(userId),
    })
      .lean()
      .populate("user_id", "avatar_path full_name");
    // merge 'friends' and 'public' post
    listPost = [...listFriendPost, ...listPost, ...listUserPost];
    listPost = _.reverse(_.sortBy(listPost, "uploadAt"));

    const listFriends = _.map(listFriendsDb, (x) => x.requester_id.toString());

    let listFriendsPhoto = [];

    if (!listPost || listPost.length < 1)
      return res.status(404).json(response(false, listPost));

    //check liked and Friend
    console.log(listPost);
    listPost.forEach((x) => {
      const listLikeOfThisPost = _.map(x.list_likes, (item) => {
        return item.toString();
      });

      //Check Friend
      const isFriend = _.includes(listFriends, x.user_id._id.toString());

      x.isFriend = isFriend ? true : false;
      // Check Like
      const isLike = _.includes(listLikeOfThisPost, userId);
      x.uploadAt = formatTimeUpload(x.uploadAt);
      if (isLike) {
        x.liked = true;
      }
    });
    const resList = _.uniqWith(listPost, _.isEqual);
    return res.status(200).json(response(true, resList));
  };
  //Get all Posts of user
  getListAllMyPost = async (req, res) => {
    const userId = res.locals.payload.id;
    let listPhoto = await Photo.find({ user_id: userId })
      .lean()
      .populate("user_id", "avatar_path full_name")
      .sort({ uploadAt: -1 });

    if (!listPhoto || listPhoto.length < 1)
      return res.status(404).json(response(true, listPhoto));

    //check liked
    listPhoto.forEach((x) => {
      const listLikeOfThisPost = _.map(x.list_likes, (item) => {
        return item.toString();
      });
      const isLike = _.includes(listLikeOfThisPost, userId);

      console.log(listLikeOfThisPost);
      if (isLike) {
        x.liked = true;
      }
      x.uploadAt = formatTimeUpload(x.uploadAt);
    });

    return res.status(200).json(response(true, listPhoto));
  };

  //Get all Posts of user
  getListAllAnotherPost = async (req, res) => {
    const userId = res.locals.payload.id;
    const anotherId = req.body.anotherId;
    let listPhoto;
    if (userId == anotherId) {
      listPhoto = await Photo.find({ user_id: anotherId })
        .lean()
        .populate("user_id", "avatar_path full_name")
        .sort({ uploadAt: -1 });
    } else {
      listPhoto = await Photo.find({ user_id: anotherId, privacy: "public" })
        .lean()
        .populate("user_id", "avatar_path full_name")
        .sort({ uploadAt: -1 });
    }
    if (!listPhoto || listPhoto.length < 1)
      return res.status(404).json(response(true, listPhoto));

    //check liked
    listPhoto.forEach((x) => {
      const listLikeOfThisPost = _.map(x.list_likes, (item) => {
        return item.toString();
      });
      const isLike = _.includes(listLikeOfThisPost, userId);

      console.log(listLikeOfThisPost);
      if (isLike) {
        x.liked = true;
      }
      x.uploadAt = formatTimeUpload(x.uploadAt);
    });

    return res.status(200).json(response(true, listPhoto));
  };
  //Get list Photo of user
  getListPhoto = async (req, res) => {
    const userId = res.locals.payload.id;
    const photos = await Photo.find({ user_id: userId });
    const listPhoto = _.flatMap(photos, "photo_path");
    return res.status(200).json({ status: true, listPhotos: listPhoto });
  };
  //Get list another user
  getListPhotoAnotherUser = async (req, res) => {
    const anotherId = req.body.anotherId;
    const userId = res.locals.payload.id;
    if (anotherId == userId) {
      const photos = await Photo.find({ user_id: userId });
      const listPhoto = _.flatMap(photos, "photo_path");
      return res.status(200).json({ status: true, listPhotos: listPhoto });
    }
    const photos = await Photo.find({ user_id: anotherId, privacy: "public" });
    const listPhoto = _.flatMap(photos, "photo_path");
    return res.status(200).json({ status: true, listPhotos: listPhoto });
  };
  // Get all "public" photo_path to display in user
  getListAllPhoto = async (req, res) => {
    const userId = res.locals.payload.id;

    const photos = await Photo.find({
      privacy: "public",
      user_id: { $ne: userId },
    }).exec();

    const listPhoto = _.flatMap(photos, "photo_path");

    return res.status(200).json({ status: true, listPhotos: listPhoto });
  };

  // Create New Post/Photo
  createPost = async (req, res) => {
    const userId = res.locals.payload.id;
    const caption = req.body.caption;
    const isAvatar = req.body.isAvatar;
    const userLocation = req.body.userLocation;
    const checkinLocation = req.body.checkinLocation;
    const privacy = req.body.privacy || "public";
    const photos = req.body.photos;

    const newPhoto = new Photo({
      photo_path: photos,
      caption: caption,
      isAvatar: isAvatar,
      privacy: privacy,
      user_id: userId,
      user_location: userLocation,
      checkin_location: checkinLocation,
      comment: [],
    });
    const createdPhoto = await newPhoto.save();
    if (!createdPhoto) res.status(400).json(response(false));
    // onesignal
    let listTokenUser = await TokenOneSignal.find({
      user: { $ne: new mongoose.Types.ObjectId(userId) },
    });
    const listToken = listTokenUser.map((x) => x.token_signal);
    const listUserId = _.uniq(listTokenUser.map((x) => x.user));
    SendNotificationToDevice(
      listToken,
      `${res.locals.userName} vừa đăng bài viết mới: ${caption}`,
      listUserId,
      res.locals.payload.id,
      (error, results) => {
        if (error) {
          console.log(err);
        }
        console.log(results);
      }
    );
    return res.status(200).json(response(true, newPhoto));
  };

  // Upadte Post
  updatePost = async (req, res) => {
    const postId = req.body.postId;
    const validateFieldUpdate = _.keys(req.body);
    const dontField = [
      "isAvatar",
      "photo_path",
      "total_likes",
      "list_likes",
      "liked",
      "total_comment",
      "user_id",
    ];
    for (let i = 0; i < validateFieldUpdate.length; i++) {
      if (_.includes(dontField, validateFieldUpdate[i].toString())) {
        return res.status(400).json({
          status: false,
          message: `Dont change field: ${validateFieldUpdate[i]}`,
        });
      }
    }
    const modifyFields = _.omit(req.body, ["postId"]);
    try {
      const updated = await Photo.findByIdAndUpdate(postId, modifyFields, {
        new: true,
      });
      return res.status(200).json({ status: true });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ status: false });
    }
  };

  // DELETE post
  deletePost = async (req, res) => {
    const userId = res.locals.payload.id;
    const postId = req.body.postId;
    const findPost = await Photo.findById(postId);
    if (!findPost) {
      return res.status(400).json({ status: false, message: "postId đểu" });
    }
    if (userId != findPost.user_id.toString()) {
      return res.status(403).json({
        status: false,
        message: "Ôi bạn đâu phải chủ post này mà đòi xóa?",
      });
    }
    try {
      const deletedPost = await Photo.findByIdAndDelete(postId);

      const deletedComment = await Comments.findOneAndDelete({
        post_id: postId,
      });
      console.log(deletedPost);
      return res.status(200).json({ status: true });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false });
    }
  };
  //[POST like post]
  likePost = async (req, res) => {
    const userId = res.locals.payload.id;
    const postToLike = req.body.postId;

    //find is this post liked
    let likePostOfUser = await LikePostOfUser.findOne({ user_id: userId });
    if (!likePostOfUser) {
      const newLikePostOfUser = await LikePostOfUser.create({
        user_id: userId,
        list_posts_liked: [],
      });
      likePostOfUser = await newLikePostOfUser.save();
    }

    const listPostLikedOfPost = likePostOfUser.list_posts_liked.map((item) =>
      item.toString()
    );
    const isLike = _.includes(listPostLikedOfPost, postToLike);
    if (isLike) {
      try {
        const updateLikePostOfUser = await LikePostOfUser.updateOne(
          { user_id: userId },
          { $pull: { list_posts_liked: postToLike } }
        );
        const updateListLikeAndTotalLikeOfPost = await Photo.findByIdAndUpdate(
          postToLike,
          {
            $pull: { list_likes: userId },
            $inc: { total_likes: -1 },
          },
          { new: true }
        );
        let listTokenUser = await TokenOneSignal.find({
          user: { $ne: new mongoose.Types.ObjectId(userId) },
        });
        const listToken = listTokenUser.map((x) => x.token_signal);
        const listUserId = _.uniq(listTokenUser.map((x) => x.user));
        SendNotificationToDevice(
          listToken,
          `${res.locals.userName} vừa like ảnh của bạn`,
          listUserId,
          res.locals.payload.id,
          (error, results) => {
            if (error) {
              console.log(err);
            }
            console.log(results);
          }
        );
        return res.status(200).json(response(true));
      } catch (error) {
        return res.status(503).json({ status: false });
      }
    } else if (!isLike) {
      try {
        const updateLikePostOfUser = await LikePostOfUser.updateOne(
          { user_id: userId },
          { $push: { list_posts_liked: postToLike } }
        );
        const updateListLikeAndTotalLikeOfPost = await Photo.findByIdAndUpdate(
          postToLike,
          {
            $push: { list_likes: userId },
            $inc: { total_likes: 1 },
          },
          { new: true }
        );
        let listTokenUser = await TokenOneSignal.find({
          user: { $ne: new mongoose.Types.ObjectId(userId) },
        });
        const listToken = listTokenUser.map((x) => x.token_signal);
        const listUserId = _.uniq(listTokenUser.map((x) => x.user));
        SendNotificationToDevice(
          listToken,
          `${res.locals.userName} vừa like ảnh của bạn`,
          listUserId,
          res.locals.payload.id,
          (error, results) => {
            if (error) {
              console.log(err);
            }
            console.log(results);
          }
        );
        return res.status(200).json(response(true));
      } catch (error) {
        return res.status(503).json({ status: false });
      }
    }
  };

  //Get list like of Post
  getListLikeOfPost = async (req, res) => {
    const postId = req.body.postId;
    const listLikeOfPost = await Photo.findById(postId)
      .lean()
      .populate("list_likes", "_id full_name avatar_path");
    if (!listLikeOfPost) return res.status(500).json({ status: false });
    return res
      .status(200)
      .json(response(true, _.pick(listLikeOfPost, ["_id", "list_likes"])));
  };

  // Add Comment
  // Enhance add photo to comment
  addComment = async (req, res) => {
    const userId = res.locals.payload.id;
    const postId = req.body.postId;
    const comment = req.body.comment;

    let foundPost = await Comments.findOne({ post_id: postId });
    if (!foundPost) {
      foundPost = await Comments.create({
        post_id: postId,
        comments: {
          userId: new mongoose.Types.ObjectId(userId),
          comment: comment,
        },
      });
      return res.status(200).json(repsonse(true, foundPost));
    }

    try {
      const dataToInsert = {
        _id: new mongoose.Types.ObjectId(),
        user_id: userId,
        comment: comment,
        comment_time: Date.now(),
      };
      const addComment = await Comments.findOneAndUpdate(
        {
          post_id: postId,
        },
        {
          $push: { comments: dataToInsert },
        },
        { new: true }
      );
      const totalComments = await Photo.findByIdAndUpdate(postId, {
        $inc: { total_comment: 1 },
      });
      let listTokenUser = await TokenOneSignal.find({
        user: { $ne: new mongoose.Types.ObjectId(userId) },
      });
      const listToken = listTokenUser.map((x) => x.token_signal);
      const listUserId = _.uniq(listTokenUser.map((x) => x.user));
      SendNotificationToDevice(
        listToken,
        `${res.locals.userName} vừa comment ảnh của bạn: ${comment}`,
        listUserId,
        res.locals.payload.id,
        (error, results) => {
          if (error) {
            console.log(err);
          }
          console.log(results);
        }
      );

      return res.status(200).json({ status: true });
    } catch (error) {
      console.log("add comment failed: ", error);
      return res.status(503).json({ status: false });
    }
  };

  // Delete Comment
  deleteComment = async (req, res) => {
    const userId = res.locals.payload.id;
    const postId = req.body.postId;
    const commentId = req.body.commentId;

    try {
      const deleted = await Comments.findOneAndUpdate(
        { post_id: postId },
        {
          $pull: { comments: { _id: commentId } },
        }
      );
      if (deleted) {
        const incTotalcmt = await Photo.findByIdAndUpdate(postId, {
          $inc: { total_comment: -1 },
        });
      }
      return res.status(200).json({ status: true });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false });
    }
  };

  // Update comment
  updateComment = async (req, res) => {
    const userId = res.locals.payload.id;
    const postId = req.body.postId;
    const commentId = req.body.commentId;
    const newComment = req.body.newComment;

    try {
      const updated = await Comments.findOneAndUpdate(
        { post_id: postId, "comments._id": commentId },
        {
          $set: { "comments.$.comment": newComment },
        },
        { new: true }
      );
      return res.status(200).json({ status: true });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false });
    }
  };

  // Show list comments of post
  getListCommentOfPost = async (req, res) => {
    const userId = res.locals.payload.id;
    const postId = req.body.postId;

    let foundComments = await Comments.findOne({ post_id: postId })
      .lean()
      .populate("comments.user_id", "full_name avatar_path");
    console.log(foundComments);
    if (!foundComments) {
      try {
        const initComment = new Comments({
          post_id: postId,
          comments: [],
        });
        return res
          .status(200)
          .json({ status: true, data: await initComment.save() });
      } catch (error) {
        return res.status(200).json({
          status: true,
          data: {
            _id: "NULLID",
            post_id: postId,
            comments: [],
          },
        });
      }
    }
    console.log(foundComments);
    foundComments.comments = _.map(foundComments.comments, (item) => {
      const statusTime = formatTimeUpload(item.comment_time);
      const is_commented = userId == item.user_id._id.toString() ? true : false;
      console.log(is_commented, userId, item.user_id);
      return {
        _id: item._id,
        user: item.user_id,
        comment: item.comment,
        comment_time: statusTime,
        is_commented: is_commented,
      };
    });
    return res.status(200).json({
      status: true,
      data: foundComments,
    });
  };

  // Hidden Like
  hiddenLike = async (req, res) => {
    const userId = res.locals.payload.id;
    const postId = req.body.postId;

    //hiddenLike
    try {
      const findPost = await Photo.findById(postId);
      if (findPost.hidden_like) {
        findPost.hidden_like = false;
      } else {
        findPost.hidden_like = true;
      }
      await findPost.save();
      return res.status(200).json({ status: true });
    } catch (error) {
      return res.status(500).json({ status: false });
    }
  };

  //Hidden Comment
  hiddenCmt = async (req, res) => {
    const userId = res.locals.payload.id;
    const postId = req.body.postId;

    //hiddenLike
    try {
      const findPost = await Photo.findById(postId);
      if (findPost.hidden_cmt) {
        findPost.hidden_cmt = false;
      } else {
        findPost.hidden_cmt = true;
      }
      await findPost.save();
      return res.status(200).json({ status: true });
    } catch (error) {
      return res.status(500).json({ status: false });
    }
  };
}

module.exports = new PhotoController();
