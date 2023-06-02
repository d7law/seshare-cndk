const mongoose = require("mongoose");
const { formatTimeUpload } = require("../utils/format-date");
const Schema = mongoose.Schema;

const tokenOneSignalSchema = new Schema(
  {
    token_signal: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Model = mongoose.model("TokenOneSignal", tokenOneSignalSchema);
Model.createCollection();
module.exports = Model;
