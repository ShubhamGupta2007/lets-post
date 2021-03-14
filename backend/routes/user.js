const express = require("express");
const {
  signUp,
  signIn,
  signOut,
  forgotPassword,
  resetPassword,
  userById,
  getAllUsers,
  getUser,
  requireSigin,
  updateUser,
  deleteUser,
  getPhoto,
  addFollower,
  addFollowing,
  removeFollowing,
  removeFollower,
  findPeople,
} = require("../controllers/user");
const {
  userSignupValidator,
  userUpdateValidator,
  passwordResetValidator,
  userSigninValidator,
} = require("../validators/allValidators.js");

const router = express.Router();

//signin signout signin routes
router.post("/signup", userSignupValidator, signUp);
router.post("/signin", userSigninValidator, signIn);
router.get("/signout", signOut);

//all user routes

router.put("/user/follow", requireSigin, addFollowing, addFollower);
router.put("/user/unfollow", requireSigin, removeFollowing, removeFollower);

router.get("/users", getAllUsers);

router.get("/user/:userId", requireSigin, getUser);
router.put("/user/:userId", requireSigin, updateUser);
router.delete("/user/:userId", requireSigin, deleteUser);

// who to follow
router.get("/user/findpeople/:userId", requireSigin, findPeople);

router.get("/user/photo/:userId", getPhoto);

//param
//if url contains userid then userByid will run
router.param("userId", userById);
module.exports = router;
