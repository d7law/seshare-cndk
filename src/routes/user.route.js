const userRoute = require("express").Router();
const authController = require("../controllers/auth.controller");

userRoute.post("/user/get-all", authController.getAll);

userRoute.post("/user/profile", authController.userProfile);
userRoute.post("/user/updale-profile", authController.updateProfile);
userRoute.get("/configs", (req, res) => {
  return res.json({ version: "1.0.0" });
});
module.exports = userRoute;
