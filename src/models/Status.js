const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statusSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  user_status: {
    type: String,
    default: "Hello SeShare",
    require: false,
  },
});

const Model = mongoose.model("Status", statusSchema);
Model.createCollection();
module.exports = Model;
