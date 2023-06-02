const Story = require("../models/Story");
const ListStories = require("../models/ListStories");
const _ = require("lodash");
const { response } = require("../models/ResponseModel");
const { formatTimeUpload, isOver24Hours } = require("../utils/format-date");
const { default: mongoose } = require("mongoose");

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

  //Get My Stories
  getMyStories = async (req, res) => {
    const userId = res.locals.payload.id;
    const myStories = await Story.find({ user: userId })
      .lean()
      .populate("user", "_id, full_name avatar_path");
    const values = myStories.map((x) => ({
      ...x,
      upload_time: formatTimeUpload(x.createdAt),
    }));
    return res.status(200).json(response(true, values));
  };

  //Get stories
  homePageListStories = async (req, res) => {
    const userId = res.locals.payload.id;
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

    const matchedItems = [];
    const remainingItems = [];
    console.log(values);
    values.forEach((x) => {
      if (x.user._id == userId && !_.isEmpty(x.story)) {
        matchedItems.push(x);
      } else if (x.user._id != userId && !_.isEmpty(x.story)) {
        remainingItems.push(x);
      }
    });

    const shuffledRemainingItems = _.shuffle(remainingItems);
    const result = matchedItems
      .map((x) => {
        return { ...x, is_your_stories: true };
      })
      .concat(
        shuffledRemainingItems.map((x) => {
          const story = x.story
            .filter((s) => s.privacy === "public")
            .map((s) => ({ ...s }));
          return { ...x, story: story, is_your_stories: false };
        })
      );

    return res.status(200).json(response(true, result));
  };

  updateFavorite = async (req, res) => {
    const userId = res.locals.payload.id;
    const { storyId } = req.body;

    let story = await Story.findById(storyId);
    if (story.user._id != userId)
      return res
        .status(403)
        .json({ status: false, message: "Ban ko co quyen de lam cai nay dau" });
    try {
      story.is_favorite = story.is_favorite ? false : true;
      await story.save();
      return res.status(200).json({ status: true });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false });
    }
  };

  // get My Favorite story
  getMyFavorite = async (req, res) => {
    const userId = res.locals.payload.id;

    const favorite = await Story.find({
      user: new mongoose.Types.ObjectId(userId),
      is_favorite: true,
    })
      .lean()
      .populate("user", "_id, full_name avatar_path");
    const values = _.map(favorite, (e) => ({
      ...e,
      upload_time: formatTimeUpload(e.createdAt),
    }));

    res
      .status(200)
      .json(response(true, { stories: values, is_your_stories: true }));
  };

  // get another story
  getAnotherFavorite = async (req, res) => {
    const userId = res.locals.payload.id;
    const { anotherId } = req.body;

    const favorite = await Story.find({
      user: anotherId,
      is_favorite: true,
    })
      .lean()
      .populate("user", "_id, full_name avatar_path");
    const values = _.map(favorite, (e) => ({
      ...e,
      upload_time: formatTimeUpload(e.createdAt),
    }));

    return userId === anotherId
      ? res
          .status(200)
          .json(response(true, { stories: values, is_your_stories: true }))
      : res
          .status(200)
          .json(response(true, { stories: values, is_your_stories: false }));
  };
}

module.exports = new StoryController();
