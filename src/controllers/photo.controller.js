const Photo = require("../models/Photo");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { makeRandom } = require("../utils/format-text");
var response = require("../models/ResponseModel").response;

class PhotoController {
  // DELETE all records
  deleteAllRecords = async (req, res) => {
    return res.status(200).json(await Photo.deleteMany());
  };
  // DELETE record by Id
  deleteRecordById = async (req, res) => {
    const result = await Photo.findByIdAndDelete(req.body.recordId);
    return res.json(result);
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
    const listPhoto = await Photo.find({ privacy: "public" })
      .lean()
      .populate("user_id", "avatar_path full_name")
      .sort({ uploadAt: -1 });
    if (!listPhoto || listPhoto.length < 1)
      return res.status(404).json(response(false, listPhoto));
    return res.status(200).json(response(true, listPhoto));
  };
  //Get all Photo of user
  getPhoto = async (req, res) => {
    const userId = res.locals.payload.id;

    const photos = await Photo.find({ user_id: userId });
    res.status(200).json(response(true, photos));
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
    return res.status(200).json(response(true, newPhoto));
  };

  //[POST like post]
  likePost = async (req, res) => {
    console.log("payload: ", res.locals.payload);
  };
}

module.exports = new PhotoController();
