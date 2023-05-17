const storyRoute = require("express").Router();
const storyController = require("../controllers/story.controller");

storyRoute.post(
  "/story/home-page-stories",
  storyController.homePageListStories
);
// storyRoute.post("/story/get-story", storyController);
storyRoute.post("/story/all-my-stories", storyController.getMyStories);
storyRoute.post("/story/create-story", storyController.createStory);
storyRoute.post("/story/delete-story", storyController.deleteStory);
storyRoute.post("/story/update-favorite", storyController.updateFavorite);
storyRoute.post("/story/get-my-favorite", storyController.getMyFavorite);
storyRoute.post(
  "/story/get-another-favorite",
  storyController.getAnotherFavorite
);

module.exports = storyRoute;
