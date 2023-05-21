const friendRoute = require("express").Router();
const friendController = require("../controllers/friend.controller");
const FriendsController = require("../controllers/friend.controller");

friendRoute.post("/friends/pending", FriendsController.pendingFriend);
friendRoute.post("/friends/requested", FriendsController.requestedAddFriend);
friendRoute.post("/friends/send-request", FriendsController.requestAddFriend);
friendRoute.post("/friends/accept-friend", friendController.acceptAddFriend);
friendRoute.post(
  "/friends/deny-or-unfriend",
  friendController.denyAddFriendOrUnfriend
);
friendRoute.post("/friends/list-friends", friendController.listFriend);

module.exports = friendRoute;
