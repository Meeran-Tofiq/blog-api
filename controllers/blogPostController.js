const BlogPost = require("../models/blogPost");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwtUtil = require("../util/jwtUtil");

let blogPostController = {};

blogPostController.postBlogPost = [
	body("title")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("Title must be at least 3 characters."),
	body("content")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("content must be at least 3 characters."),
	,
	body("isPublished")
		.isBoolean()
		.withMessage("Choose whether this post is published or not."),
	,
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (errors) {
			res.send(400).json({ errors });
		}

		try {
			const decoded = await jwtUtil.verifyWebToken(req.token);
			const user = decoded.user;

			if (!user.canPost) {
				throw new Error();
			}

			const blogPost = new BlogPost({
				user: user._id,
				title: req.body.title,
				content: req.body.content,
				isPublished: req.body.isPublished,
			});

			await blogPost.save();
			res.sendStatus(200);
		} catch (error) {
			res.status(403).json("Unable to verify user, or user can't post.");
		}
	}),
];

blogPostController.getBlogPost = asyncHandler(async (req, res, next) => {
	const blogPost = await BlogPost.findById(req.params.blogPostId).exec();
	if (!blogPost) res.status(404).json("Not found.");
	res.status(200).json({ data: blogPost });
});

blogPostController.getMultipleBlogPosts = asyncHandler(
	async (req, res, next) => {
		const blogPosts = await BlogPost.find()
			.sort({ date: -1 })
			.limit(20)
			.exec();
		res.status(200).json({ data: blogPosts });
	}
);

blogPostController.putBlogPost = [
	body("title")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("Title must be at least 3 characters."),
	body("content")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("content must be at least 3 characters."),
	,
	body("isPublished")
		.isBoolean()
		.withMessage("Choose whether this post is published or not."),
	,
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (errors) {
			res.send(400).json({ errors });
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

			if (blogPostToUpdate.user !== user.id) {
				throw new Error("Unauthorized");
			}

			await BlogPost.updateOne(
				{ _id: req.params.blogPostId },
				{
					$set: {
						title: req.body.title,
						content: req.body.content,
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

blogPostController.deleteBlogPost = asyncHandler((req, res, next) => {});

module.exports = blogPostController;
