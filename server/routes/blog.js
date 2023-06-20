import express from "express";
import {
  listAllPublishedArticles,
  getArticle,
  createComment_POST,
  deleteComment_DELETE,
  updateComment_PUT,
} from "../controllers/blogController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).json({ sucess: true, msg: "Home Page TechTalentTrove" });
});

// GET all published Articles
router.get("/posts", listAllPublishedArticles);

// GET specific article
router.get("/post/:postId", getArticle);

// POST create a comment in an article
router.post("/post/:postId/comment", authenticateToken, createComment_POST);

router
  .route("/post/:postId/comment/:commentId")
  .delete(authenticateToken, deleteComment_DELETE)
  .put(authenticateToken, updateComment_PUT);

export default router;
