const Story = require("../models/Story");
const ListStories = require("../models/ListStories");
const { response } = require("../models/ResponseModel");

class StoryController {
  //Create Story
  createStory = async (req, res) => {
    const userId = res.locals.payload.id;
    const inputData = req.body;
    const data = {
      photo_path: inputData.photoPath,
      x_text: inputData.xText,
      y_text: inputData.yText,
      color_text: inputData.colorText,
      text: inputData.text,
      privacy: inputData.privacy,
      user: userId,
    };
    const initStory = await Story.create(data);
    const savedStory = await initStory.save();

    // Add story to ListStories
    let foundListStoriesOfUser = await ListStories.findOne({ user: userId });
    if (!foundListStoriesOfUser) {
      foundListStoriesOfUser = await ListStories.create({
        user: userId,
        story: [savedStory],
      });
      try {
        const savedListStories = await foundListStoriesOfUser.save();
        return res.status(200).json(response(true, savedStory));
      } catch (error) {
        console.log(error);
        return res.status(400).json(response(false));
      }
    }

    try {
      const savedListStories = await ListStories.findByIdAndUpdate(
        foundListStoriesOfUser._id,
        {
          $push: { story: savedStory },
        }
      );
      return res.status(200).json(response(true, savedStory));
    } catch (error) {
      console.log(error);
      return res.status(400).json(response(false));
    }
  };
}

module.exports = new StoryController();
