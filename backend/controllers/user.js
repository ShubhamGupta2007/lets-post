const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
require("dotenv").config();
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

//sigin sigout and singup routes
exports.signUp = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res.status(403).json({
      error: "Email is taken!",
    });
  const user = await new User(req.body);
  await user.save();
  return res.status(200).json({ message: "Signup success! Please login." });
};

exports.signIn = (req, res) => {
  const { email, password } = req.body;
  //checking if user exits or not
  User.findOne({ email }, (err, user) => {
    if (err || !user)
      return res.status(403).json({
        error: "User with that email not found Please signup!",
      });

    //checking for password
    if (!user.authenticate(password)) {
      return res.status(403).json({
        error: "Email and password do not match!",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // res.cookie("token", token, { expire: new Date() + 999 });

    const { _id, name, email } = user;

    return res.json({
      token,
      user: { _id, name, email },
    });
  });
};

exports.signOut = (req, res) => {
  res.clearCookie("token");
  return res.json({
    message: "Signout success",
  });
};

exports.requireSigin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  // console.log(req.profile);
  // console.log(req.auth);
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorised",
    });
  }
  next();
};

//all user methords

exports.userById = (req, res, next, id) => {
  User.findById(id, (error, result) => {
    if (error || !result) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = result;
    next();
  })
    .populate("following", "_id name")
    .populate("followers", "_id name");
};

exports.getAllUsers = (req, res) => {
  User.find((error, result) => {
    if (error || !result) {
      return res.status(400).json({
        error: "Not able to found the user",
      });
    }
    return res.json({
      users: result,
    });
  }).select("_id name email created");
};

exports.getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json({
    user: req.profile,
  });
};

//updating the user
exports.updateUser = (req, res) => {
  let form = new formidable.IncomingForm();
  // console.log("incoming form data: ", form);
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    // save user
    let user = req.profile;
    // console.log("user in update: ", user);
    user = _.extend(user, fields);
    console.log(files);
    user.updated = Date.now();

    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }

    if (fields.email) {
      const userExists = await User.findOne({ email: fields.email });
      if (userExists && !_.isEqual(userExists._id, user._id)) {
        return res.status(403).json({
          error: "Taken already taken ! Try again with different email",
        });
      }
    }
    // console.log("hello");
    await user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      // console.log("user after update with formdata: ", user);
      return res.json(user);
    });
  });
};

//deleting the user
exports.deleteUser = (req, res) => {
  let user = req.profile;
  user.remove((error, result) => {
    if (error)
      return res.status(400).json({
        error: "Can't delete the user",
      });

    result.salt = undefined;
    result.hashed_password = undefined;
    return res.json({ message: "User deleted successfully" });
  });
};

exports.getPhoto = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set(("Content-Type", req.profile.photo.contentType));
    return res.send(req.profile.photo.data);
  }
  next();
};

// follow unfollow
exports.addFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $push: { following: req.body.followId } },
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      next();
    }
  );
};

exports.addFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    { $push: { followers: req.body.userId } },
    { new: true }
  )
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      result.hashed_password = undefined;
      result.salt = undefined;
      result.photo = undefined;
      return res.json(result);
    });
};

// remove follow unfollow
exports.removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $pull: { following: req.body.unfollowId } },
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      next();
    }
  );
};

exports.removeFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    { $pull: { followers: req.body.userId } },
    { new: true }
  )
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      result.hashed_password = undefined;
      result.salt = undefined;

      result.photo = undefined;
      return res.json(result);
    });
};

exports.findPeople = (req, res) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  User.find({ _id: { $nin: following } }, (err, users) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    return res.json(users);
  }).select("_id name email ");
};
