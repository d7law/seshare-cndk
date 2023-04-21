const friendRoute = require("./friend.route");
const userRoute = require("./user.route");

function initRouter(app) {
  app.use("/api", userRoute);
  app.use("/api", friendRoute);
}

module.exports = initRouter;
