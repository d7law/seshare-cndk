const Story = require("../models/Story");
const ListStories = require("../models/ListStories");
const _ = require("lodash");
const { response } = require("../models/ResponseModel");
const { formatTimeUpload, isOver24Hours } = require("../utils/format-date");

class StoryController {
  //Create Story
  createStory = async (req, res) => {
    const userId = res.locals.payload.id;
    const inputData = req.body;
    const data = {
      photo_path: inputData.photoPath,
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

  //Delete story
  deleteStory = async (req, res) => {
    const userId = res.locals.payload.id;
    const storyId = req.body.storyId;

    try {
      const deletedFromList = await ListStories.findOneAndUpdate(
        { user: userId },
        {
          $pull: { story: storyId },
        }
      );
      const deletedStory = await Story.findByIdAndDelete(storyId);
      return res.status(200).json({ status: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false });
    }
  };

  //Get stories
  getListStories = async (req, res) => {
    //update over 24h
    const updateOverStory = await Story.find({});
    _.forEach(updateOverStory, async (x) => {
      if (!isOver24Hours(x.createdAt)) {
        await Story.findByIdAndUpdate(x._id, { $set: { is_over: true } });
      }
    });

    const allStories = await ListStories.find()
      .lean()
      .populate("user", "_id, full_name avatar_path")
      .populate("story");

    const values = allStories.map((e) => {
      const story = e.story
        .filter((s) => !s.is_over)
        .map((s) => ({ ...s, upload_time: formatTimeUpload(s.createdAt) }));
      return { ...e, story };
    });
    return res.status(200).json(response(true, values));
  };
}

module.exports = new StoryController();
