import express from "express";
const router = express.Router();

import {
  listAllUsers_GET,
  createUser_POST,
  deleteUser_DELETE,
  createPost_POST,
  deletePost_DELETE,
  publishArticle_PUT,
  unpublishArticle_PUT,
  listAllPosts_GET,
  listAllCommentsFromPost_GET,
  createComment_POST,
  deleteComment_DELETE,
} from "../controllers/adminController.js";

router.get("/", function (req, res, next) {
  res.status(200).json({ sucess: true, msg: "Home screen api" });
});

/**
 * USERS
 */
router.get("/users", listAllUsers_GET);

router.post("/user", createUser_POST);

router.delete("/user/:id", deleteUser_DELETE);

// router.post('/user/login', loginUser_POST)

/**
 * POSTS
 */
router.get("/posts", listAllPosts_GET);

router.post("/post", createPost_POST);

router.put('/post/:postId/publish', publishArticle_PUT)
router.put('/post/:postId/unpublish', unpublishArticle_PUT)

router.delete("/post/:id", deletePost_DELETE);

/**
 * COMMENTS
 */
router.get("/post/:postId/comments", listAllCommentsFromPost_GET);

router.post("/post/:postId/comment", createComment_POST);

router.delete("/post/:postId/comment/:id", deleteComment_DELETE);

export default router;
