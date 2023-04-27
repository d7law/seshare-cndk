const photoRoute = require("express").Router();
const photoController = require("../controllers/photo.controller");
const { upload } = require("../services/upload.service");

photoRoute.post("/photo/homepage-posts", photoController.homePagePosts);
photoRoute.post("/photo/get-photo-user", photoController.getPhoto);
photoRoute.post("/photo/upload-post", photoController.createPost);
photoRoute.post(
  "/photo/upload",
  upload.single("photo"),
  photoController.uploadPhoto
);

photoRoute.delete(
  "/photo/delete-all-records",
  photoController.deleteAllRecords
);

module.exports = photoRoute;
