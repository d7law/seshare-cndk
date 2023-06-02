const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listStoriesSchema = new Schema({
  own_user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  content: {
    type: String,
    default: "",
  },
  who_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Model = mongoose.model("ListStories", listStoriesSchema);
Model.createCollection();
module.exports = Model;
