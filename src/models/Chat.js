const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  content: {
    type: String,
  },
  user: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Model = mongoose.model("Chat", chatSchema);
Model.createCollection();
module.exports = Model;
