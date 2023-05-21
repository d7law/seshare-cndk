const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendSchema = new Schema(
  {
    requester_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    recipient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    recipient_name: {
      type: String,
      ref: "User",
    },
    status: {
      type: Number,
      enums: [
        0, //add friend
        1, //requested
        2, //pending
        3, //friend
      ],
    },
  },
  { timestamps: true }
);
const Model = mongoose.model("Friend", friendSchema);
Model.createCollection();
module.exports = Model;
