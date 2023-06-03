const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notiSchema = new Schema(
  {
    own_user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    content: {
      type: String,
      default: "",
    },
    who_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Model = mongoose.model("Notification", notiSchema);
Model.createCollection();
module.exports = Model;
