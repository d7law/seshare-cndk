const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listStoriesSchema = new Schema({
  story: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Model = mongoose.model("ListStories", listStoriesSchema);
Model.createCollection();
module.exports = Model;