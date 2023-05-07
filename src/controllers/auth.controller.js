const User = require("../models/User");
const Photo = require("../models/Photo");
const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
var response = require("../models/ResponseModel").authResponse;
const { makeRandom } = require("../utils/format-text");
const { formatToDate } = require("../utils/format-date");
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
    if (!req.body.phone || !req.body.password) {
      console.log(req.body.phone, req.body.password);
      return res.status(401).json({ status: false });
    }
    try {
      let findUser = await User.find({
        phone: req.body.phone,
      });
      console.log("sign-up-user:", findUser);
      if (findUser.length > 0) {
        return res.status(404).json({ status: false });
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
        avatar_path: req.body.avatar,
        bio: "",
      };
      const newUser = new User(data);
      const createdUser = await newUser.save();

      if (req.file) {
        await Photo.create({
          photo_path: avatarPath,
          caption: "Register avatar",
          isAvatar: true,
          privacy: "private",
          user_id: createdUser._id,
          user_location: "",
          checkin_location: "",
          comment: [],
        });
      }
      console.log(createdUser);
      const returnPro = _.omit(createdUser.toObject(), ["password", "age"]);
      returnPro.age = formatToDate(createdUser.age);
      return res.status(200).json(response(true, returnPro));
    } catch (err) {
      console.log(err);
      return res.status(503).json({ status: false });
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
        return res.status(404).json({ status: false });
      }
      //const compare = bcrypt.compareSync(password, foundUser.password);
      const compare = (() => {
        if (password === foundUser.password) return true;
        return false;
      })();
      console.log(`this is compare`, compare);
      if (!compare) {
        return res.status(401).json({ status: false });
      }
      const jwtoken = jwt.sign(
        {
          id: foundUser._id,
          phone: foundUser.phone,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
      const returnPro = _.omit(foundUser.toObject(), ["password", "age"]);
      returnPro.age = formatToDate(foundUser.age);
      return res.status(200).json(response(true, returnPro, jwtoken));
    } catch (error) {
      console.log(error);
      return res.status(503).json({ status: false });
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

  //[POST] user profile
  async userProfile(req, res) {
    const phone = res.locals.payload.phone;
    let profile = await User.findOne({ phone });
    if (!profile) return res.status(404).json({ status: false });

    const returnPro = _.omit(profile.toObject(), ["password", "age"]);
    returnPro.age = formatToDate(profile.age);

    return res.status(200).json(response(true, returnPro));
  }

  //[POST] another profile
  async anotherProfile(req, res) {
    const userId = res.locals.payload.id;
    const anotherId = req.body.anotherId;
    if (anotherId == userId) {
      const profile = await User.findById(userId);
      if (!profile) return res.status(404).json({ status: false });
      const returnPro = _.omit(profile.toObject(), ["password", "age"]);
      returnPro.age = formatToDate(profile.age);
      return res.status(200).json(response(true, returnPro));
    }
    const anotherProfile = await User.findById(anotherId);
    if (!anotherProfile) return res.status(404).json({ status: false });
    const returnPro = _.omit(anotherProfile.toObject(), ["password", "age"]);
    returnPro.age = formatToDate(anotherProfile.age);
    console.log(returnPro);
    return res.status(200).json(response(true, returnPro));
  }

  //[POST] update profile user
  async updateProfile(req, res) {
    const phone = res.locals.payload.phone;

    const modifyFields = _.omit(req.body, ["phone"]);
    try {
      const updated = await User.findOneAndUpdate(
        { phone: phone },
        modifyFields,
        { new: true }
      );
      const returnPro = _.omit(updated.toObject(), ["password", "age"]);
      returnPro.age = formatToDate(updated.age);
      return res.status(200).json(response(true, returnPro));
    } catch (err) {
      return res.status(503).json({ status: false });
    }
  }

  //[POST] delete field
  deleteField = async (req, res) => {
    const users = await User.find();
    users.forEach(async (x) => {
      await User.updateOne({ _id: x._id }, { $unset: { photos: 1 } });
    });
    return res.json("ok");
  };
  //[POST] update field
  updateField = async (req, res) => {
    const users = await Photo.find({});
    const result = users.forEach(async (x) => {
      await Photo.updateOne({ _id: x._id }, { $set: { list_likes: [] } });
    });
    return res.json(result);
  };

  //[POST] change password
  changePsw = async (req, res) => {
    const phone = res.locals.payload.phone;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const foundUser = await User.findOne({ phone: phone });
    if (oldPassword != foundUser.password) {
      return res.status(401).json({ status: false });
    }
    const updated = await User.findOneAndUpdate(
      { phone: phone },
      { $set: { password: newPassword } },
      { new: true }
    );
    return res.status(200).json(response(true, updated));
  };

  //[POST] forgot password
  forgotPsw = async (req, res) => {
    const phone = req.body.phone;
    const newPassword = req.body.newPassword;
    const foundUser = await User.findOne({ phone: phone });
    if (!foundUser) return res.status(404).json({ status: false });
    const updated = await User.findOneAndUpdate(
      { phone: phone },
      { $set: { password: newPassword } },
      { new: true }
    );
    return res.status(200).json(response(true, updated));
  };

  //get all user to search
  searchingUser = async (req, res)=>{
    
  }
}

module.exports = new AuthController();
