const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
  id: String,
  text: {
    type: String,
    default: ""
  },
  userId: Number,
  created_at: {
    type: Number,
    default: 0
  },
  entities: {
    urls: [
      {
        short_url: String,
        desc: String
      }
    ],
    media: [
      {
        type: String,
        link: String
      }
    ]
  },
  stats: {
    retweets: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    }
  }
});

module.exports = mongoose.model("Tweet", tweetSchema);
