const express = require("express");
const router = express.Router({ mergeParams: true });
const commentController = require("../controllers/commentController");

// CREATE COMMENT
router.post("/", commentController.postComment);

// READ COMMENT(S)
router.get("/", commentController.getMultipleComments);
router.get("/:commentId", commentController.getComment);

// UPDATE COMMENT
router.put("/:commentId", commentController.putComment);

// DELETE COMMENT
router.delete("/:commentId", commentController.deleteComment);

module.exports = router;
