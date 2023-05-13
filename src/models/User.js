const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//tele Khang: 0762449965
const userSchema = new Schema(
  {
    phone: {
      type: String,

      unique: true,
    },
    password: {
      type: String,
    },
    age: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Nam", "Nữ", "Khác"],
      default: "Khác",
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    full_name: {
      type: String,
    },
    place: {
      type: String,
      default: "",
    },
    avatar_path: {
      type: String,

      default: "",
    },
    background_path: {
      type: String,

      default: "",
    },
    bio: {
      type: String,

      default: "Hello World",
    },
    study_info: {
      type: String,
    },
    work_info: {
      type: String,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Friends",
      },
    ],
    status: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Status",
      },
    ],
  },
  { timestamps: true }
);
const Model = mongoose.model("User", userSchema);
Model.createCollection();
module.exports = Model;
