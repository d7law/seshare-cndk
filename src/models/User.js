const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//tele Khang: 0762449965
const userSchema = new Schema(
  {
    phone: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    age: {
      type: Date,
      require: false,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
      require: false,
    },
    first_name: {
      type: String,
      require: false,
    },
    last_name: {
      type: String,
      require: false,
    },
    full_name: {
      type: String,
      require: true,
    },
    place: {
      type: String,
      require: false,
    },
    avatar_path: {
      type: String,
      require: false,
      default: "",
    },
    bio: {
      type: String,
      require: false,
    },
    study_info: {
      type: String,
      require: false,
    },
    work_info: {
      type: String,
      require: false,
    },
    photos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Photo",
      },
    ],
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
