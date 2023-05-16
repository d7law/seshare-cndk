const mongoose = require("mongoose");
const { formatTimeUpload } = require("../utils/format-date");
const Schema = mongoose.Schema;

const storySchema = new Schema(
  {
    photo_path: {
      type: String,
      required: true,
    },
    x_text: {
      type: Number,
      required: false,
      default: 0,
    },
    y_text: {
      type: Number,
      required: false,
      default: 0,
    },
    color_text: {
      type: String,
      require: false,
      default: "0xFFFFFF",
    },
    text: {
      type: String,
      required: false,
      default: "",
    },
    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    is_over: {
      type: Boolean,
      default: false,
    },
    upload_time: {
      type: String,
      default: formatTimeUpload(Date.now()),
    },
  },
  { timestamps: true }
);

const Model = mongoose.model("Story", storySchema);
Model.createCollection();
module.exports = Model;
