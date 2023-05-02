const authController = require("../controllers/auth.controller");
const { checkToken } = require("../middleware/checkToken");
const friendRoute = require("./friend.route");
const photoRoute = require("./photo.route");
const userRoute = require("./user.route");
const { upload } = require("../services/upload.service");
const photoController = require("../controllers/photo.controller");

function initRouter(app) {
  app.use("/api/login", authController.logIn);
  app.use("/api/sign-up", upload.single("avatar"), authController.signUp);
  app.post(
    "/api/upload-without-token",
    upload.single("photo"),
    photoController.uploadPhoto
  );

  app.use("/api/check-phone", authController.checkPhone);
  app.use("/api/delete-account", authController.deleteAccount);

  app.use(checkToken);
  app.use("/api", userRoute);
  app.use("/api", friendRoute);
  app.use("/api", photoRoute);
}

module.exports = initRouter;
