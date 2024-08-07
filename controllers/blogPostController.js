const BlogPost = require("../models/blogPost");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwtUtil = require("../util/jwtUtil");
const sanitizeHtml = require("sanitize-html");

let blogPostController = {};

blogPostController.postBlogPost = [
	body("title")
		.trim()
		.isLength({ min: 3 })
		.withMessage("Title must be at least 3 characters."),
	body("content")
		.trim()
		.isLength({ min: 3 })
		.withMessage("content must be at least 3 characters."),
	body("isPublished")
		.isBoolean()
		.withMessage("Choose whether this post is published or not."),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const [title, content] = [
			sanitizeHtml(req.body.title),
			sanitizeHtml(req.body.content),
		];

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const decoded = await jwtUtil.verifyWebToken(req.token);
			const user = decoded.user;

			if (!user.canPost) {
				throw new Error("Unauthorized");
			}

			const blogPost = new BlogPost({
				user: user._id,
				title: title,
				content: content,
				isPublished: req.body.isPublished,
			});

			await blogPost.save();
			res.sendStatus(200);
		} catch (error) {
			if (
				error.name === "JsonWebTokenError" ||
				error.name === "TokenExpiredError"
			) {
				res.status(403).json("Invalid or expired token.");
			} else if (error.message === "Unauthorized") {
				res.status(403).json("User is not authorized to post.");
			} else {
				res.status(500).json("Internal server error.");
			}
		}
	}),
];

blogPostController.getBlogPost = asyncHandler(async (req, res, next) => {
	try {
		const blogPost = await BlogPost.findById(req.params.blogPostId)
			.populate("user", "username")
			.exec();

		res.status(200).json({ data: blogPost });
	} catch (error) {
		if (error.name === "CastError") {
			res.status(404).json("Blog post not found.");
		} else {
			res.status(500).json("Internal server error.");
		}
	}
});

blogPostController.getMultipleBlogPosts = asyncHandler(
	async (req, res, next) => {
		try {
			const blogPosts = await BlogPost.find()
				.populate("user", "username")
				.sort({ date: -1 })
				.limit(20)
				.exec();
			res.status(200).json({ data: blogPosts });
		} catch (error) {
			res.status(500).json("Internal server error.");
		}
	}
);

blogPostController.putBlogPost = [
	body("title")
		.optional()
		.trim()
		.isLength({ min: 3 })
		.withMessage("Title must be at least 3 characters."),
	body("content")
		.optional()
		.trim()
		.isLength({ min: 3 })
		.withMessage("content must be at least 3 characters."),
	body("isPublished")
		.optional()
		.isBoolean()
		.withMessage("Choose whether this post is published or not."),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const [title, content] = [
			sanitizeHtml(req.body.title),
			sanitizeHtml(req.body.content),
		];

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const decoded = await jwtUtil.verifyWebToken(req.token);
			const user = decoded.user;
			const blogPostToUpdate = await BlogPost.findById(
				req.params.blogPostId
			).exec();

			if (!blogPostToUpdate) {
				throw new Error("CastError");
			}

			if (blogPostToUpdate.user.toString() !== user._id) {
				throw new Error("Unauthorized");
			}

			await BlogPost.updateOne(
				{ _id: req.params.blogPostId },
				{
					$set: {
						title: title,
						content: content,
						isPublished: req.body.isPublished,
						date: Date.now(),
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
			} else if (error.message === "Unauthorized") {
				res.status(403).json(
					"User is not authorized to update this blog post."
				);
			} else if (error.name === "CastError") {
				res.status(404).json("Blog post not found.");
			} else {
				res.status(500).json("Internal server error.");
			}
		}
	}),
];

blogPostController.deleteBlogPost = asyncHandler(async (req, res, next) => {
	try {
		const decoded = await jwtUtil.verifyWebToken(req.token);
		const user = decoded.user;
		const blogPostToDelete = await BlogPost.findById(
			req.params.blogPostId
		).exec();

		if (!blogPostToDelete) {
			throw new Error("CastError");
		}

		if (blogPostToDelete.user.toString() !== user._id) {
			throw new Error("Unauthorized");
		}

		await BlogPost.deleteOne({ _id: req.params.blogPostId });
		res.sendStatus(200);
	} catch (error) {
		if (
			error.name === "JsonWebTokenError" ||
			error.name === "TokenExpiredError"
		) {
			res.status(403).json("Invalid or expired token.");
		} else if (error.message === "Unauthorized") {
			res.status(403).json(
				"User is not authorized to delete this blog post."
			);
		} else if (error.name === "CastError") {
			res.status(404).json("Blog post not found.");
		} else {
			res.status(500).json("Internal server error.");
		}
	}
});

module.exports = blogPostController;
