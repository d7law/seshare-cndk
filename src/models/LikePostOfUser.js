const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likePostOfUserSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
    unique: true,
  },
  list_posts_liked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photo",
    },
  ],
});

const Model = mongoose.model("LikePostOfUser", likePostOfUserSchema);
Model.createCollection();
module.exports = Model;
