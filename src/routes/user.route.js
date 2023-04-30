const userRoute = require("express").Router();
const authController = require("../controllers/auth.controller");
const { checkToken } = require("../middleware/checkToken");
const { upload } = require("../services/upload.service");

userRoute.post("/user/get-all", authController.getAll);
userRoute.post("/user/sign-up", upload.single("avatar"), authController.signUp);
userRoute.post("/user/login", authController.logIn);
userRoute.post("/user/check-phone", authController.checkPhone);
userRoute.post("/user/delete-account", authController.deleteAccount);

userRoute.post("/user/profile", authController.userProfile);
userRoute.post("/user/updale-profile", authController.updateProfile);
userRoute.get("/configs", (req, res) => {
  return res.json({ version: "1.0.0" });
});
module.exports = userRoute;
