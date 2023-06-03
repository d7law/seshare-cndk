const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Photo",
  },
  comments: [
    {
      _id: {
        type: new mongoose.Schema.Types.ObjectId(),
        unique: true,
      },
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
      },
      comment_time: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});
const Model = mongoose.model("Comment", commentSchema);
Model.createCollection();
module.exports = Model;
