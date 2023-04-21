const User = require("../models/User");
const Photo = require("../models/Photo");
const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
var response = require("../models/ResponseModel").authResponse;
class AuthController {
  //[GET] /user/all
  async getAll(req, res) {
    try {
      let users = await User.find();
      return res.status(200).json(response(true, users));
    } catch (err) {
      console.log(err);
      return res.status(503).json(response(false, "Loi server"));
    }
  }
  //[POST] /user/sign-up
  async signUp(req, res, next) {
    try {
      let findUser = await User.find({
        phone: req.body.phone,
      });
      if (findUser.length > 0) {
        return res.status(404).json(response(false, "User nay da ton tai"));
      }
      let avatarPath;
      if (req.file) {
        fs.renameSync(
          req.file.path,
          req.file.path.replace("undefined", req.body.phone)
        );
        avatarPath = path.basename(
          req.file.path.replace("undefined", req.body.phone)
        );
      }

      const data = {
        phone: req.body.phone,
        password: req.body.password,
        full_name: req.body.fullName,
        age: req.body.age,
        avatar_path: avatarPath ?? "",
      };
      const newUser = new User(data);
      const createdUser = await newUser.save();

      if (req.file) {
        await Photo.create({
          photo_path: avatarPath,
          isAvatar: true,
          privacy: "public",
          user_id: createdUser._id,
        });
      }
      console.log(createdUser);
      return res.status(200).json(response(true, newUser));
    } catch (err) {
      console.log(err);
      return res.status(503).json(response(false, "Loi Server"));
    }
  }

  //[POST] /user/log-in
  async logIn(req, res) {
    const phone = req.body.phone;
    const password = req.body.password;
    try {
      let foundUser = await User.findOne({
        phone: phone,
      });
      if (!foundUser) {
        return res
          .status(404)
          .json(response(false, "So dien thoai nay khong ton tai!"));
      }
      //const compare = bcrypt.compareSync(password, foundUser.password);
      const compare = (() => {
        if (password === foundUser.password) return true;
        return false;
      })();
      console.log(`this is compare`, compare);
      if (!compare) {
        return res.status(401).json(response(false, "Unauthorized"));
      }
      const jwtoken = jwt.sign(
        { id: foundUser._id, exp: Math.floor(Date.now() / 1000 + 60 * 60) },
        process.env.JWT_SECRET
      );
      const user = _.omit(foundUser, ["password"]);
      return res.status(200).json(response(true, user, jwtoken));
    } catch (error) {
      console.log(error);
      return res.status(503).json(response(false, "Loi server"));
    }
  }

  //[POST] /user/check-phone
  async checkPhone(req, res) {
    const phone = req.body.phone;
    try {
      let foundUser = await User.findOne({ phone: phone });
      if (foundUser) {
        return res
          .status(404)
          .json(response(false, "So dien thoai nay da ton tai"));
      }
      return res
        .status(200)
        .json(response(true, "So dien thoai nay co the dang ky!"));
    } catch (err) {
      console.log(err);
      return res.status(503).json(response(false, "Loi server"));
    }
  }

  //[POST] /user/delete-account
  async deleteAccount(req, res) {
    const phone = req.body.phone;
    try {
      const delUser = await User.deleteOne({ phone: phone });
      console.log(delUser);
      if (delUser.deletedCount > 0) {
        return res.status(200).json(response(true, "Xóa thành công user"));
      }
      return res.status(404).json(response(false, "Khong co user nay"));
    } catch (err) {
      console.log(err);
      return res.status(503).json(response(false, "Loi server"));
    }
  }
}

module.exports = new AuthController();
