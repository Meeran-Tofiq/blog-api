const express = require("express");
const router = express.Router();
const blogPostController = require("../controllers/blogPostController");

// CREATE BLOG POST
router.post("/", blogPostController.postBlogPost);

// READ BLOG POST(S)
router.get("/", blogPostController.getMultipleBlogPosts);
router.get("/:blogPostId", blogPostController.getBlogPost);

// UPDATE BLOG POST
router.put("/:blogPostId", blogPostController.putBlogPost);

// DELETE BLOG POST
router.delete("/:blogPostId", blogPostController.deleteBlogPost);

module.exports = router;
