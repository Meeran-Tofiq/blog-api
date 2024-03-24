const express = require("express");
const router = express.Router();

// ROUTERS
const usersRouter = require("./users");
const commentsRouter = require("./comments");
const blogPostsRouter = require("./blogPosts");

router.use("/users", usersRouter);
router.use("/blog-posts", blogPostsRouter);
router.use("/blog-posts/:blogPostId/comments", commentsRouter);

module.exports = router;
