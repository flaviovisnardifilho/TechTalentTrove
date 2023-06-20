import prisma from "../prisma/index.js";
import jwt from "jsonwebtoken";

/**
 * USERS
 */
const listAllUsers_GET = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({});
    res.status(200).json({ sucess: true, msg: users });
  } catch (err) {
    next(err);
  }
};

const createUser_POST = async (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then(async (hash) => {
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          hash,
        },
      });

      if (!newUser) {
        res.status(401).json({
          sucess: false,
          msg: "Could not find user",
        });
      }
    })
    .catch((err) => next(err));

  res.status(200).json({ sucess: true, msg: "User Created" });
};

const deleteUser_DELETE = async (req, res, next) => {
  const { id } = req.params;
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (!user) res.json({ sucess: false, msg: "User not found" });

  const deletePosts = await prisma.post.deleteMany({
    where: {
      authorId: id,
    },
  });

  const deleteUser = await prisma.user.delete({
    where: {
      id,
    },
  });

  res
    .status(200)
    .json({ sucess: true, msg: `User deleted ${deleteUser.name}` });
};

/**
 * POSTS
 */
const listAllPosts_GET = async (req, res, err) => {
  const posts = await prisma.post.findMany({});

  res.status(200).json({ sucess: true, msg: posts });
};

const createPost_POST = async (req, res, next) => {
  const author = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (!author) {
    res.status(404).json({ sucess: false, msg: "User not found" });
  }

  const newPost = await prisma.post.create({
    data: {
      title: req.body.title,
      content: req.body.content,
      authorId: author.id,
      // Prod only:
      id: req.body.postId,
    },
  });
  res.status(200).json({ sucess: true, msg: newPost.title });
};

const deletePost_DELETE = async (req, res, next) => {
  const { postId } = req.params;
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) res.status(404).json({ sucess: false, msg: "Post not found" });

  const deletePost = await prisma.post.delete({
    where: {
      id,
    },
  });

  res
    .status(200)
    .json({ sucess: true, msg: `Post deleted ${deletePost.title}` });
};

const publishArticle_PUT = async (req, res, err) => {
  const { postId } = req.params;
  const updatePost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      published: true,
      createdAt: new Date(),
    },
  });

  if (!updatePost) {
    res.status(404).json({ sucess: false, msg: "Post not found" });
  }

  res
    .status(200)
    .json({ sucess: true, msg: `Post ${updatePost.title} published!` });
};

const unpublishArticle_PUT = async (req, res, err) => {
  const { postId } = req.params;
  const updatePost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      published: false,
    },
  });

  if (!updatePost) {
    res.status(404).json({ sucess: false, msg: "Post not found" });
  }

  res
    .status(200)
    .json({ sucess: true, msg: `Post ${updatePost.title} unpublished!` });
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

  res.status(200).json({ sucess: true, msg: posts });
};

const createComment_POST = async (req, res, next) => {
  const { postId } = req.params;
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    res.status(404).json({ sucess: false, msg: "Post not found" });
  }

  const author = await prisma.user.findUnique({
    where: {
      id: req.body.userId,
    },
  });

  if (!author) {
    res.status(404).json({ sucess: false, msg: "User not found" });
  }

  const newComment = await prisma.comment.create({
    data: {
      content: req.body.comment,
      postId,
      userId: req.body.userId,
      // Prod only:
      id: req.body.commentId,
    },
  });
  res.status(200).json({ sucess: true, msg: newComment });
};

const deleteComment_DELETE = async (req, res, next) => {
  const { id } = req.params;

  const deleteComment = await prisma.comment.delete({
    where: {
      id,
    },
  });

  if (!deleteComment) {
    res.status(404).json({ sucess: false, msg: "Comment not found." });
  }

  res
    .status(200)
    .json({ sucess: true, msg: `Comment deleted: `, deleteComment });
};

export {
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
};
