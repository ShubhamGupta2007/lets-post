const mongoose = require("mongoose");
const User = require("../models/user");
const { ObjectId } = mongoose.Schema;
const formidable = require("formidable");
const postSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  photo: {
    data: Buffer,
    contentTpye: String,
  },
  postedBy: {
    type: ObjectId,
    ref: "User",
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  updated: {
    type: Date,
  },
  likes: [{ type: ObjectId, ref: "User" }],
  comments: [
    {
      text: String,
      created: { type: Date, default: Date.now },
      postedBy: {
        type: ObjectId,
        ref: "User",
      },
    },
  ],
});
module.exports = mongoose.model("Post", postSchema);
