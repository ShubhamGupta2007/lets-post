const Post = require("../models/post");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");
exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "_id name")
    .populate("comments", "text created")
    .populate("comments.postedBy", "_id name")
    .exec((error, result) => {
      if (error || !result) {
        return res.status(400).json({
          error: "Post not found",
        });
      }
      // console.log(result);
      req.post = result;
      next();
    });
};

exports.getAllPosts = async (req, res) => {
  // get current page from req.query or use default value of 1
  const currentPage = req.query.page || 1;
  // return 3 posts per page
  const perPage = 9;
  let totalItems;

  const posts = await Post.find()
    // countDocuments() gives you total count of posts
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .populate("comments", "text created")
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .sort({ created: -1 })
        .limit(perPage)
        .select("_id title body likes");
    })
    .then((posts) => {
      res.status(200).json({ posts });
    })
    .catch((err) => console.log(err));
};

exports.getAllPostsByUser = (req, res) => {
  Post.find({ postedBy: req.profile._id })
    .populate("postedBy", "_id name")
    .select("_id title body created likes")
    .populate("comments", "text created")
    .populate("comments.postedBy", "_id name")
    .sort("_created")
    .exec((error, posts) => {
      if (error) {
        return res.status(403).json({
          error,
        });
      }
      return res.json({ posts });
    });
};

exports.createPost = (req, res) => {
  let form = new formidable.IncomingForm();

  form.keepExtensions = true;

  form.parse(req, (err, feilds, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    let post = new Post(feilds);
    post.postedBy = req.profile;

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.contentTpye = files.photo.type;
    }

    post.save((error, result) => {
      if (error) {
        return res.status(400).json({
          error,
        });
      }
      result.postedBy.salt = undefined;
      result.postedBy.hashed_password = undefined;
      res.json(result);
    });
  });
};

exports.isPoster = (req, res, next) => {
  const authorized =
    req.post && req.auth && req.post.postedBy._id == req.auth._id;
  // console.log(req.profile);
  // console.log(req.auth);
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorised",
    });
  }
  next();
};

exports.updatePost = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    // save post
    let post = req.post;
    post = _.extend(post, fields);
    post.updated = Date.now();

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }

    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      return res.json(post);
    });
  });
};

exports.deletePost = (req, res) => {
  const post = req.post;

  post.remove((error, result) => {
    if (error) {
      return res.status(403).json({
        error,
      });
    }
    return res.json({
      message: "Post deleted successfully",
    });
  });
};

exports.getphoto = (req, res, next) => {
  res.set("Content-Type", req.post.photo.contentType);
  return res.send(req.post.photo.data);
};

exports.getPost = (req, res, next) => {
  req.post.photo = undefined;
  return res.json({ post: req.post });
};

exports.like = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { likes: req.body.userId } },
    { new: true }
  ).exec((error, result) => {
    if (error) {
      return res.status(403).json(error);
    }
    return res.json(result);
  });
};

exports.unlike = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { likes: req.body.userId } },
    { new: true }
  ).exec((error, result) => {
    if (error) {
      return res.status(403).json(error);
    }
    return res.json(result);
  });
};

exports.comment = (req, res) => {
  let comment = req.body.comment;
  comment.postedBy = req.body.userId;

  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: comment } },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      } else {
        // console.log(result);
        return res.json(result);
      }
    });
};

exports.uncomment = (req, res) => {
  let comment = req.body.comment;

  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { comments: { _id: comment._id } } },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      } else {
        return res.json(result);
      }
    });
};
