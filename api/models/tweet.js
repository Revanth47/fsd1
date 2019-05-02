const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tweetSchema = new Schema({
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
        type: {
          type: String,
          enum: ["video", "image"]
        },
        link: String,
        url: String
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
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Tweet", tweetSchema);
