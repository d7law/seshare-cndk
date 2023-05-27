const authController = require("../controllers/auth.controller");
const { checkToken } = require("../middleware/checkToken");
const friendRoute = require("./friend.route");
const photoRoute = require("./photo.route");
const userRoute = require("./user.route");
const { upload } = require("../services/upload.service");
const photoController = require("../controllers/photo.controller");
const resize = require("../utils/resize");
const path = require("path");
const storyRoute = require("./story.route");
const filterController = require("../controllers/filter.controller");

function initRouter(app) {
  /*
   ** INTERNAL API
   */
  app.post("/api/delete-field", authController.deleteField);
  app.post("/api/update-field", authController.updateField);
  app.delete(
    "/api/delete-all-comments",
    photoController.deleteAllRecordsComment
  );
  /*
   ** EXTERNAL API
   */
  app.get("/video/:path", (req, res) => {
    return res.sendFile(path.join(__dirname, "..", "uploads", req.params.path));
  });
  app.get("/:path", (req, res) => {
    const pathStr = req.params.path;
    const widthStr = req.query.width;
    const heightStr = req.query.height;
    const fit = req.query.fit;
    const format = req.query.format;

    if (widthStr) {
      width = parseInt(parseFloat(widthStr).toFixed());
    }
    if (heightStr) {
      height = parseInt(parseFloat(heightStr).toFixed());
    }
    res.type(`image/${format || "png"}`);
    try {
      resize(
        path.join(__dirname, "..", "uploads", pathStr),
        format,
        width,
        height,
        fit
      ).pipe(res);
    } catch (err) {
      res.sendStatus(404);
    }
  });

  //send otp
  app.use("/api/require-otp", authController.requireOtp);

  app.use("/api/login", authController.logIn);
  app.use("/api/sign-up", upload.single("avatar"), authController.signUp);
  app.post(
    "/api/upload-without-token",
    upload.single("photo"),
    photoController.uploadPhoto
  );
  app.use("/api/filter/search", filterController.searchUser);
  app.use("/api/filter/populate", filterController.populateUserAndPhoto);

  app.use("/api/forgot-password", authController.forgotPsw);
  app.use("/api/check-phone", authController.checkPhone);
  app.use("/api/delete-account", authController.deleteAccount);

  app.use(checkToken);
  app.use("/api", userRoute);
  app.use("/api", friendRoute);
  app.use("/api", photoRoute);
  app.use("/api", storyRoute);
}

module.exports = initRouter;
