const storyRoute = require("express").Router();
const storyController = require("../controllers/story.controller");

storyRoute.post("/story/get-list-stories", storyController.getListStories);
// storyRoute.post("/story/get-story", storyController);
storyRoute.post("/story/all-my-stories", storyController.getMyStories);
storyRoute.post("/story/create-story", storyController.createStory);
storyRoute.post("/story/delete-story", storyController.deleteStory);
storyRoute.post('/story/update-favorite', storyController.updateFavorite)

module.exports = storyRoute;
