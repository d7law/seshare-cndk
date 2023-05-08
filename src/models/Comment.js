const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photo",
    },
    comments: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);
const Model = mongoose.model("Comments", commentSchema);
Model.createCollection();
module.exports = Model;