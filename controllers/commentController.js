const BlogPost = require("../models/blogPost");
const Comment = require("../models/comment");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwtUtil = require("../util/jwtUtil");

let commentController = {};

commentController.postComment = [
	body("content")
		.trim()
		.escape()
		.notEmpty()
		.withMessage("Comment cannot be empty."),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const decoded = await jwtUtil.verifyWebToken(req.token);
			const user = decoded.user;
			const blogPost = await BlogPost.findById(
				req.params.blogPostId
			).exec();

			if (!user) return res.status(404).json("User not found.");
			if (!blogPost) return res.status(404).json("Blog post not found.");

			const comment = new Comment({
				user: user._id,
				blogPost: blogPost._id,
				content: req.body.content,
			});

			await comment.save();
			res.sendStatus(200);
		} catch (error) {
			if (
				error.name === "JsonWebTokenError" ||
				error.name === "TokenExpiredError"
			) {
				res.status(403).json("Invalid or expired token.");
			} else {
				res.status(500).json("Internal server error.");
			}
		}
	}),
];

commentController.getComment = asyncHandler(async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.commentId)
			.populate("user", "username")
			.exec();

		if (!comment) return res.status(404).json("Comment not found.");

		res.status(200).json({ data: comment });
	} catch (error) {
		res.status(500).json("Internal server error.");
	}
});

commentController.getMultipleComments = asyncHandler(async (req, res, next) => {
	try {
		const comments = await Comment.find({ blogPost: req.params.blogPostId })
			.sort({ date: -1 })
			.limit(20)
			.populate("user", "username")
			.exec();

		if (!comments) return res.status(404).json("Comments not found.");

		res.status(200).json({ data: comments });
	} catch (error) {}
});

commentController.putComment = [
	body("content")
		.trim()
		.escape()
		.notEmpty()
		.withMessage("Comment cannot be empty."),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const decoded = await jwtUtil.verifyWebToken(req.token);
			const user = decoded.user;
			const commentToUpdate = await Comment.findById(
				req.params.commentId
			).exec();

			if (!user) return res.status(404).json("User not found.");
			if (!commentToUpdate)
				return res.status(404).json("Comment not found.");
			if (commentToUpdate.user.toString() !== user._id)
				return res.status(403).json("User not authorized.");

			await Comment.updateOne(
				{ _id: req.params.commentId },
				{
					$set: {
						content: req.body.content,
					},
				}
			);
			res.sendStatus(200);
		} catch (error) {
			if (
				error.name === "JsonWebTokenError" ||
				error.name === "TokenExpiredError"
			) {
				res.status(403).json("Invalid or expired token.");
			} else {
				res.status(500).json("Internal server error.");
			}
		}
	}),
];

commentController.deleteComment = asyncHandler(async (req, res, next) => {
	try {
		const decoded = await jwtUtil.verifyWebToken(req.token);
		const user = decoded.user;
		const commentToUpdate = await Comment.findById(
			req.params.commentId
		).exec();

		if (!user) return res.status(404).json("User not found.");
		if (!commentToUpdate) return res.status(404).json("Comment not found.");
		if (commentToUpdate.user.toString() !== user._id)
			return res.status(403).json("User not authorized.");

		await Comment.deleteOne({ _id: req.params.commentId });
		res.sendStatus(200);
	} catch (error) {
		if (
			error.name === "JsonWebTokenError" ||
			error.name === "TokenExpiredError"
		) {
			res.status(403).json("Invalid or expired token.");
		} else {
			res.status(500).json("Internal server error.");
		}
	}
});

module.exports = commentController;
