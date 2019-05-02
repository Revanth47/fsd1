const userModel = require("../models/user");
const tweetModel = require("../models/tweet");
const bcrypt = require("bcrypt");

/**
 * user sign up method
 */
function createUser(req, res, next) {
  const userObj = {
    user_name: req.body.user_name,
    user_email: req.body.user_email,
    user_pass: req.body.user_pass,
    profile_img: `https://fsd1.herokuapp.com/images/user_2.png`,
    cover_img: `https://fsd1.herokuapp.com/images/timeline.png`,
    following: [1, 2]
  };
  userModel.create(userObj, function(err, data) {
    if (err) next(err);
    else {
      res.json({
        status: "success",
        message: "User added successfully!!!",
        data: {
          userId: data.id
        }
      });
    }
  });
}

/**
 * User login method
 */
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
 * User profile update method
 */
function editProfile(req, res, next) {
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
    const params = req.swagger.params;
    if (params.user_name.value) {
      user.user_name = params.user_name.value;
    }
    if (params.user_email.value) {
      user.user_email = params.user_email.value;
    }
    if (params.user_website.value) {
      user.user_website = params.user_website.value;
    }
    if (params.user_from.value) {
      user.user_from = params.user_from.value;
    }
    if (params.user_birthday.value) {
      user.user_birthday = params.user_birthday.value;
    }
    if (params.full_name.value) {
      user.full_name = params.full_name.value;
    }
    user.save(function(err) {
      if (err) {
        next(err);
        return;
      }

      return res.json({
        status: "success",
        message: "Successfully updated user's profile"
      });
    });
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
function userMedia(req, res, next) {
  const userId = Number(req.swagger.params.userId.value);
  tweetModel
    .aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$entities.media"
        }
      },
      { $unwind: "$_id" }
    ])
    .limit(10)
    .exec(function(err, mediaInfo) {
      if (err) {
        next(err);
        return;
      } else if (!mediaInfo) {
        return res.status(400).json({
          message: "User with the given ID does not exist"
        });
      }
      const data = mediaInfo.map(d => d._id);
      return res.json({ status: "success", data });
    });
}

/**
 * Suggest people for the user to follow
 */
function userFollowersSuggestions(req, res, next) {
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
    const excludeUsersList = [userId, ...(user.following || [])];
    userModel
      .find({ id: { $nin: excludeUsersList } }, "-user_pass -_id")
      .limit(5)
      .exec(function(err, data) {
        if (err) {
          next(err);
          return;
        }

        return res.json({ status: "success", data });
      });
  });
}

/**
 * Details of the people the user is following
 */
function userFollowing(req, res, next) {
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
    userModel
      .find({ id: { $in: includeUsersList } }, "-user_pass -_id")
      .limit(10)
      .exec(function(err, data) {
        if (err) {
          next(err);
          return;
        }

        return res.json({ status: "success", data });
      });
  });
}

/**
 * Tweets made by the people the user is following
 */
function userFollowingTweets(req, res, next) {
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
    tweetModel
      .find({ userId: { $in: includeUsersList } })
      .limit(10)
      .populate("user", "-user_pass")
      .exec(function(err, data) {
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
function userTweets(req, res, next) {
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
    tweetModel
      .find({ userId })
      .limit(10)
      .populate("user", "-user_pass")
      .exec(function(err, data) {
        if (err) {
          next(err);
          return;
        }

        return res.json({ status: "success", data });
      });
  });
}

function userFollowers(req, res, next) {
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
    userModel
      .find({ user_name: searchQuery, following: userId }, "-user_pass")
      .limit(10)
      .exec(function(err, data) {
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
  userFollowers,
  editProfile
};
