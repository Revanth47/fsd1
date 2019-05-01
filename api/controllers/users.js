const userModel = require("../models/user");
const tweetModel = require("../models/tweet");
const bcrypt = require("bcrypt");

function createUser(req, res, next) {
  const userObj = {
    user_name: req.body.user_name,
    user_email: req.body.user_email,
    user_password: req.body.user_password
  };
  userModel.create(userObj, function(err) {
    if (err) next(err);
    else
      res.json({
        status: "success",
        message: "User added successfully!!!",
        data: null
      });
  });
}

function authenticateUser(req, res, next) {
  userModel.findOne({ user_email: req.body.user_email }, function(
    err,
    userInfo
  ) {
    if (err) {
      next(err);
    } else {
      if (bcrypt.compareSync(req.body.user_pass, userInfo.user_pass)) {
        res.json({
          status: "success",
          message: "Logged in successfully"
        });
      } else {
        res.json({
          status: "error",
          message: "Invalid credentials!!!",
          data: null
        });
      }
    }
  });
}

/**
 * Get a particular user's details
 */
function userDetails(req, res, next) {
  const userId = Number(req.swagger.params.userId.value);
  userModel.findOne({ id: userId }, "-user_pass", function(err, userInfo) {
    if (err) {
      next(err);
      return;
    } else if (!userInfo) {
      return res.status(400).json({
        message: "User with the given ID does not exist"
      });
    }
    return res.json({
      status: "success",
      data: userInfo
    });
  });
}

/**
 * Photos and videos shared by the user
 */
function userMedia(req, res) {
  const userId = Number(req.swagger.params.userId.value);
  tweetModel.find({ userId }, "entities.media", function(err, mediaInfo) {
    if (!err) {
      return res.json({ status: "success", data: mediaInfo });
    } else if (!mediaInfo) {
      return res.status(400).json({
        message: "User with the given ID does not exist"
      });
    }
    next(err);
  });
}

/**
 * Suggest people for the user to follow
 */
function userFollowersSuggestions(req, res) {
  const userId = Number(req.swagger.params.userId.value);
  userModel.findOne({ id: userId }, "following", function(err, user) {
    if (err) {
      next(err);
      return;
    } else if (!user) {
      return res.status(400).json({
        message: "User with the given ID does not exist"
      });
    }
    const exludeUsersList = (user.following || []).push(userId);
    userModal.find(
      { id: { $nin: exludeUsersList } },
      "-user_pass -_id",
      function(err, data) {
        if (err) {
          next(err);
          return;
        }

        return res.json({ status: "success", data });
      }
    );
  });
}

/**
 * Details of the people the user is following
 */
function userFollowing(req, res) {
  const userId = Number(req.swagger.params.userId.value);
  userModel.findOne({ id: userId }, "following", function(err, user) {
    if (err) {
      next(err);
      return;
    } else if (!user) {
      return res.status(400).json({
        message: "User with the given ID does not exist"
      });
    }
    const includeUsersList = user.following || [];
    userModal.find(
      { id: { $in: includeUsersList } },
      "-user_pass -_id",
      function(err, data) {
        if (err) {
          next(err);
          return;
        }

        return res.json({ status: "success", data });
      }
    );
  });
}

/**
 * Tweets made by the people the user is following
 */
function userFollowingTweets(req, res) {
  const userId = Number(req.swagger.params.userId.value);
  userModel.findOne({ id: userId }, function(err, user) {
    if (err) {
      next(err);
      return;
    } else if (!user) {
      return res.status(400).json({
        message: "User with the given ID does not exist"
      });
    }
    const includeUsersList = user.following || [];
    tweetModel.find({ userId: { $in: includeUsersList } }, function(err, data) {
      if (err) {
        next(err);
        return;
      }

      return res.json({ status: "success", data });
    });
  });
}

/**
 * Get the tweets made by a user
 */
function userTweets(req, res) {
  const userId = Number(req.swagger.params.userId.value);
  userModel.findOne({ id: userId }, function(err, user) {
    if (err) {
      next(err);
      return;
    } else if (!user) {
      return res.status(400).json({
        message: "User with the given ID does not exist"
      });
    }
    tweetModel.find({ userId }, function(err, data) {
      if (err) {
        next(err);
        return;
      }

      return res.json({ status: "success", data });
    });
  });
}

function userFollowers(req, res) {
  const query = req.swagger.params.query.value || "";
  const userId = Number(req.swagger.params.userId.value);
  userModel.findOne({ id: userId }, function(err, user) {
    if (err) {
      next(err);
      return;
    } else if (!user) {
      return res.status(400).json({
        message: "User with the given ID does not exist"
      });
    }
    const searchQuery = new RegExp(query, "i");
    userModel.find({ user_name: searchQuery }, "-user_pass", function(
      err,
      data
    ) {
      if (err) {
        next(err);
        return;
      }

      return res.json({ status: "success", data });
    });
  });
}

module.exports = {
  createUser,
  authenticateUser,
  userDetails,
  userMedia,
  userFollowersSuggestions,
  userFollowingTweets,
  userFollowing,
  userTweets,
  userFollowers
};
