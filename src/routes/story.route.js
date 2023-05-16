const storyRoute = require("express").Router();
const storyController = require("../controllers/story.controller");

storyRoute.post("/story/get-list-stories", storyController.getListStories);
// storyRoute.post("/story/get-story", storyController);
storyRoute.post("/story/create-story", storyController.createStory);
// storyRoute.post("/story/delete-story", storyController);

module.exports = storyRoute;
