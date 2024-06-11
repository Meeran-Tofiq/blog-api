const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// CREATE USER
router.post("/", userController.postUser);

// READ USER
router.get("/:userId", userController.getUser);

// UPDATE USER
router.put("/:userId", userController.putUser);

// DELETE USER
router.delete("/:userId", userController.deleteUser);

// LOGIN USER
router.post("/login", userController.postLogin);

// READ USER BLOG POSTS
router.get("/:userId/blog-posts", userController.getUserBlogPosts);

module.exports = router;
