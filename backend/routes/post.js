const express = require("express");
const {
  getAllPosts,
  createPost,
  getAllPostsByUser,
  postById,
  deletePost,
  isPoster,
  updatePost,
  getphoto,
  getPost,
  like,
  unlike,
  comment,
  uncomment,
} = require("../controllers/post");
const {
  requireSigin,
  userById,
  hasAuthorization,
} = require("../controllers/user");

const router = express.Router();

//like unlike
router.put("/post/like", requireSigin, like);
router.put("/post/unlike", requireSigin, unlike);

//commnet uncomment
router.put("/post/comment", requireSigin, comment);
router.put("/post/uncomment", requireSigin, uncomment);

router.get("/posts", getAllPosts);

router.post("/post/new/:userId", requireSigin, createPost);
router.get("/posts/by/:userId", requireSigin, getAllPostsByUser);

router.get("/post/:postId", getPost);
router.put("/post/:postId", requireSigin, isPoster, updatePost);
router.delete("/post/:postId", requireSigin, isPoster, deletePost);

// photo
router.get("/post/photo/:postId", getphoto);
router.param("userId", userById);
router.param("postId", postById);
module.exports = router;
