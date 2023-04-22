const photoRoute = require("express").Router();
const photoController = require("../controllers/photo.controller");
const { upload } = require("../services/upload.service");

photoRoute.post("/photo/get-all", photoController.getPhoto);
photoRoute.post(
  "/photo/upload-photos",
  upload.single("photo"),
  photoController.createPhoto
);

module.exports = photoRoute;
