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
photoRoute.post("/photo/get-list-photos-user", photoController.getListPhoto);
photoRoute.post(
  "/photo/get-list-photos-another-user",
  photoController.getListPhotoAnotherUser
);
photoRoute.post("/photo/get-list-all-photos", photoController.getListAllPhoto);

photoRoute.post("/photo/upload-post", photoController.createPost);
photoRoute.post("/photo/update-post", photoController.updatePost);
photoRoute.post("/photo/delete-post", photoController.deletePost);

photoRoute.post(
  "/photo/upload",
  upload.single("photo"),
  photoController.uploadPhoto
);

photoRoute.post("/photo/like", photoController.likePost);
photoRoute.post("/photo/list-like-of-post", photoController.getListLikeOfPost);

photoRoute.post("/photo/add-comment", photoController.addComment);
photoRoute.post("/photo/delete-comment", photoController.deleteComment);
photoRoute.post(
  "/photo/list-comment-of-post",
  photoController.getListCommentOfPost
);

photoRoute.delete(
  "/photo/delete-all-records",
  photoController.deleteAllRecordsPost
);
photoRoute.delete("/photo/delete-by-id", photoController.deleteRecordByPostId);
module.exports = photoRoute;
