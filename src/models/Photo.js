const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photoSchema = new Schema({
  photo_path: [
    {
      type: String,
      require: true,
    },
  ],
  caption: {
    type: String,
    require: true,
    default: "",
  },
  total_likes: {
    type: Number,
    require: true,
    default: 0,
  },
  list_likes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  liked: {
    type: Boolean,
    default: false,
  },
  comment: [
    {
      type: String,
      required: false,
    },
  ],
  isAvatar: {
    type: Boolean,
    require: true,
    default: false,
  },
  privacy: {
    type: String,
    enum: ["public", "friends", "private"],
  },
  uploadAt: {
    type: Date,
    default: Date.now,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  user_location: {
    type: String,
    require: true,
    default: "",
  },
  checkin_location: {
    type: String,
    require: true,
    default: "",
  },
});

const Photo = mongoose.model("Photo", photoSchema);
Photo.createCollection();
module.exports = Photo;
