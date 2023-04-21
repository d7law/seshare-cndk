const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const URI = process.env.MONGO_URI;
    await mongoose
      .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .catch((err) => console.log(err));
    const connection = mongoose.connection;
    console.log(URI);
    console.log("Connect DB success");
  } catch (err) {
    console.log(err);
    console.log("failed to connect db");
  }
};

module.exports = connectDB;
