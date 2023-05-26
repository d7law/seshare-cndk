const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photoSchema = new Schema({
  photo_path: [
    {
      type: String,
    },
  ],
  caption: {
    type: String,

    default: "",
  },
  total_likes: {
    type: Number,

    default: 0,
  },
  list_likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  liked: {
    type: Boolean,
    default: false,
  },
  total_comment: {
    type: Number,
    required: true,
    default: 0,
  },

  isAvatar: {
    type: Boolean,

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

    default: "",
  },
  checkin_location: {
    type: String,
    default: "",
  },
});

const Photo = mongoose.model("Photo", photoSchema);
Photo.createCollection();
module.exports = Photo;
