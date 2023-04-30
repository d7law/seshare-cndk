const friendRoute = require("./friend.route");
const photoRoute = require("./photo.route");
const userRoute = require("./user.route");

function initRouter(app) {
  app.use("/api", userRoute);
  app.use("/api", friendRoute);
  app.use("/api", photoRoute);
  app.use(
    "/api/configs",
    (req,
    (res) => {
      return res.json({ config: "1.0.0" });
    })
  );
}

module.exports = initRouter;
