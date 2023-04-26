const userRoute = require("express").Router();
const authController = require("../controllers/auth.controller");
const { upload } = require("../services/upload.service");

userRoute.post("/user/get-all", authController.getAll);
userRoute.post("/user/sign-up", upload.single("avatar"), authController.signUp);
userRoute.post("/user/login", authController.logIn);
userRoute.post("/user/check-phone", authController.checkPhone);
userRoute.post("/user/delete-account", authController.deleteAccount);

userRoute.post("/user/profile", authController.userProfile);
userRoute.post('/user/updale-profile', authController.updateProfile)

module.exports = userRoute;
