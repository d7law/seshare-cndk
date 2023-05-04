const authController = require("../controllers/auth.controller");
const { checkToken } = require("../middleware/checkToken");
const friendRoute = require("./friend.route");
const photoRoute = require("./photo.route");
const userRoute = require("./user.route");
const { upload } = require("../services/upload.service");
const photoController = require("../controllers/photo.controller");
const resize = require("../utils/resize");
const path = require("path");

function initRouter(app) {
  /*
   ** INTERNAL API
   */
  app.post("/api/delete-field", authController.deleteField);
  app.post("/api/update-field", authController.updateField);
  /*
   ** EXTERNAL API
   */
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
    resize(
      path.join(__dirname, "..", "uploads", pathStr),
      format,
      width,
      height,
      fit
    ).pipe(res);
  });

  app.use("/api/login", authController.logIn);
  app.use("/api/sign-up", upload.single("avatar"), authController.signUp);
  app.post(
    "/api/upload-without-token",
    upload.single("photo"),
    photoController.uploadPhoto
  );

  app.use("/api/forgot-password", authController.forgotPsw);
  app.use("/api/check-phone", authController.checkPhone);
  app.use("/api/delete-account", authController.deleteAccount);

  app.use(checkToken);
  app.use("/api", userRoute);
  app.use("/api", friendRoute);
  app.use("/api", photoRoute);
}

module.exports = initRouter;
