const friendRoute = require("express").Router();
const friendController = require("../controllers/friend.controller");
const FriendsController = require("../controllers/friend.controller");

friendRoute.get("/friends/requested/:id", FriendsController.requestedAddFriend);
friendRoute.post(
  "/friends/send-request/:id",
  FriendsController.requestAddFriend
);
friendRoute.post(
  "/friends/accept-friend/:id",
  friendController.acceptAddFriend
);

module.exports = friendRoute;
