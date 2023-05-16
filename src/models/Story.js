const mongoose = require("mongoose");
const { formatTimeUpload } = require("../utils/format-date");
const Schema = mongoose.Schema;

const storySchema = new Schema(
  {
    photo_path: {
      type: String,
      required: true,
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
    is_favorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Model = mongoose.model("Story", storySchema);
Model.createCollection();
module.exports = Model;
