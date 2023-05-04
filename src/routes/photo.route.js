const photoRoute = require("express").Router();
const photoController = require("../controllers/photo.controller");
const { checkToken } = require("../middleware/checkToken");
const { upload } = require("../services/upload.service");

photoRoute.post(
  "/photo/homepage-posts",
  checkToken,
  photoController.homePagePosts
);
photoRoute.post("/photo/get-photo-user", photoController.getPhoto);
photoRoute.post('/photo/get-list-photos-user', photoController.getListPhoto)
photoRoute.post("/photo/upload-post", photoController.createPost);
photoRoute.post(
  "/photo/upload",
  upload.single("photo"),
  photoController.uploadPhoto
);

photoRoute.post("/photo/like", checkToken, photoController.likePost);

photoRoute.delete(
  "/photo/delete-all-records",
  photoController.deleteAllRecords
);
photoRoute.delete("/photo/delete-by-id", photoController.deleteRecordById);

module.exports = photoRoute;
