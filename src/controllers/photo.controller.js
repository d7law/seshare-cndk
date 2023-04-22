const Photo = require("../models/Photo");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
var response = require("../models/ResponseModel").response;

class PhotoController {
  // Create New Post/Photo
  async createPhoto(req, res) {
    const userId = req.body.userId;
    const caption = req.body.caption;
    const isAvatar = req.body.isAvatar;
    const userLocation = req.body.userLocation;
    const checkinLocation = req.body.checkinLocation;
    const privacy = req.body.privacy || "public";

    try {
      let photoPath;
      if (req.file) {
        fs.renameSync(
          req.file.path,
          req.file.path.replace("undefined", userId)
        );
        photoPath = path.basename(req.file.path.replace("undefined", userId));

        const newPhoto = new Photo({
          photo_path: photoPath,
          caption: caption,
          isAvatar: isAvatar,
          privacy: privacy,
          user_id: userId,
          user_location: userLocation,
          checkin_location: checkinLocation,
        });
        const createdPhoto = await newPhoto.save();
        if (!createdPhoto) res.status(400).json(response(false));
        return res.status(200).json(response(true, newPhoto));
      }
    } catch (err) {
      res.status(502).json(response(false));
    }
  }

  //Get all Photo of user
  getPhoto = async (req, res) => {
    const userId = req.body.userId;

    const photos = await Photo.find({ user_id: userId });
    res.status(200).json(response(true, photos));
  };
}

module.exports = new PhotoController();
