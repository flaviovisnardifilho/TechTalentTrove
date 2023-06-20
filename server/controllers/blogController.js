import prisma from "../prisma/index.js";

/**
 * POSTS
 */
const getArticle = async (req, res, next) => {
  const { postId } = req.params;

  const post = await prisma.post.findFirst({
    where: {
      id: postId,
      published: true,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!post)
    return res.status(404).json({ sucess: false, msg: "Post not found" });

  return res.status(200).json({ sucess: true, msg: post });
};

const listAllPublishedArticles = async (req, res) => {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
  });

  return res.status(200).json({ sucess: true, msg: posts });
};

/**
 * COMMENTS
 */
const listAllCommentsFromPost_GET = async (req, res, next) => {
  const { postId } = req.params;
  const posts = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      comments: true,
    },
  });

  return res.status(200).json({ sucess: true, msg: posts });
};

const createComment_POST = async (req, res, next) => {
  const { postId } = req.params;
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
  if (!post) {
    return res.status(404).json({ sucess: false, msg: "Post not found" });
  }

  const newComment = await prisma.comment.create({
    data: {
      content: req.body.content,
      postId,
      userId: req.user.id,
      // Prod only:
      id: req.body.commentId,
    },
  });
  return res
    .status(200)
    .json({ sucess: true, msg: `Comment created` });
};

const deleteComment_DELETE = async (req, res, next) => {
  const { commentId } = req.params;

  const deleteComment = await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  if (!deleteComment) {
    return res.status(404).json({ sucess: false, msg: "Comment not found." });
  }

  if (req.user.id !== deleteComment.userId) return res.status(403).json({sucess: false, msg:'Not authorized'})
  return res
    .status(200)
    .json({ sucess: true, msg: `Comment deleted: `, deleteComment });
};

const updateComment_PUT = async (req, res, next) => {
  const { commentId } = req.params;

  const updateComment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content: req.body.comment,
      updatedAt: new Date(),
    }
  });

  if (!updateComment) {
    return res.status(500).json({ sucess: false, msg: "Something went wrong." });
  }

  if (req.user.id !== updateComment.userId) return res.status(403).json({sucess: false, msg:'Not authorized'})
  return res
    .status(200)
    .json({ sucess: true, msg: `Comment updated at ${updateComment.updatedAt}: `, updateComment });
};

export {
  listAllPublishedArticles,
  getArticle,
  listAllCommentsFromPost_GET,
  createComment_POST,
  deleteComment_DELETE,
  updateComment_PUT
};
