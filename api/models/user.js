const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const saltRounds = 10;

const userSchema = new mongoose.Schema({
  id: Number,
  profile_img: {
    type: String,
    default: ""
  },
  cover_img: {
    type: String,
    default: ""
  },
  full_name: {
    type: String,
    default: ""
  },
  user_bio: {
    type: String,
    default: ""
  },
  user_name: {
    type: String,
    default: ""
  },
  user_pass: {
    type: String,
    default: ""
  },
  user_email: {
    type: String,
    default: ""
  },
  user_created_at: {
    type: Number,
    default: Date.now
  },
  user_birthday: Number,
  user_from: {
    type: String,
    default: ""
  },
  user_website: { type: String, default: "" },
  following: {
    type: [Number],
    default: []
  },
  stats: {
    tweets: {
      type: Number,
      default: 0
    },
    followers: {
      type: Number,
      default: 0
    },
    following: {
      type: Number,
      default: 0
    }
  }
});

// hash user password before saving into database
userSchema.pre("save", function(next) {
  this.user_pass = bcrypt.hashSync(this.user_pass, saltRounds);
  next();
});

module.exports = mongoose.model("User", userSchema);
