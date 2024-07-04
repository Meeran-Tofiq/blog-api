const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwtUtil = require("../util/jwtUtil");
const bcrypt = require("bcryptjs");
const blogPost = require("../models/blogPost");

let userController = {};

userController.postUser = [
	body("username")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Username must not be empty.")
		.custom(async (value) => {
			const user = await User.findOne({
				username: value,
			}).exec();

			if (user) throw new Error("Username already in use.");
		})
		.withMessage("Username is already taken."),
	body("password")
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters long")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
		)
		.withMessage(
			"Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
		),
	body("canPost").trim().isBoolean().escape(),
	body("passwordConfirmation")
		.custom((value, { req }) => {
			return value === req.body.password;
		})
		.withMessage("Password and confirm password do not match."),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			bcrypt.hash(req.body.password, 10, async (err, hash) => {
				if (err) return next(err);

				const user = new User({
					username: req.body.username,
					password: hash,
					canPost: req.body.canPost,
				});

				await user.save();
				const token = jwtUtil.generateWebToken(user);
				const { password, ...userData } = user.toObject();
				res.status(200).json({ data: { token, user: userData } });
			});
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

userController.getUser = asyncHandler(async (req, res, next) => {
	try {
		const decoded = await jwtUtil.verifyWebToken(req.token);
		const tokenUser = decoded.user;
		const user = await User.findById(req.params.userId);
		console.log(tokenUser);

		if (!user) res.status(404).json("User not found.");

		if (user.username !== tokenUser.username)
			throw new Error("Unauthorized");

		res.status(200).json({ data: user });
	} catch (error) {
		if (
			error.name === "JsonWebTokenError" ||
			error.name === "TokenExpiredError"
		) {
			res.status(403).json("Invalid or expired token.");
		} else if (error.message === "Unauthorized") {
			res.status(403).json("User is not authorized to update this user.");
		} else {
			res.status(500).json("Internal server error.");
		}
	}
});

userController.putUser = [
	body("username")
		.optional()
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Username must not be empty.")
		.custom(async (value) => {
			const user = await User.findOne({
				username: value,
			}).exec();

			if (user) return false;

			return true;
		})
		.withMessage("Username is already taken."),
	body("password")
		.optional()
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters long")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
		)
		.withMessage(
			"Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
		),
	body("canPost").trim().isBoolean().escape().optional(),
	body("passwordConfirmation")
		.optional()
		.custom((value, { req }) => {
			return value === req.body.password;
		})
		.withMessage("Password and confirm password do not match."),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const decoded = await jwtUtil.verifyWebToken(req.token);
			const user = decoded.user;
			const userToUpdate = await User.findById(req.params.userId).exec();

			if (!userToUpdate) {
				throw new Error("CastError");
			}

			if (userToUpdate.id.toString() !== user._id) {
				throw new Error("Unauthorized");
			}

			const updateObject = {};
			if (req.body.username) {
				updateObject.username = req.body.username;
			}
			if (req.body.password) {
				updateObject.password = req.body.password;
			}
			if (req.body.canPost) {
				updateObject.canPost = req.body.canPost;
			}

			await User.updateOne(
				{ _id: req.params.userId },
				{ $set: updateObject }
			);
			const updatedUser = await User.findById(req.params.userId).exec();
			const token = jwtUtil.generateWebToken(updatedUser);
			res.status(200).json({ data: token });
		} catch (error) {
			if (
				error.name === "JsonWebTokenError" ||
				error.name === "TokenExpiredError"
			) {
				res.status(403).json("Invalid or expired token.");
			} else if (error.message === "Unauthorized") {
				res.status(403).json(
					"User is not authorized to update this user."
				);
			} else if (error.name === "CastError") {
				res.status(404).json("User not found.");
			} else {
				res.status(500).json("Internal server error.");
			}
		}
	}),
];

userController.deleteUser = asyncHandler(async (req, res, next) => {
	try {
		const decoded = await jwtUtil.verifyWebToken(req.token);
		const user = decoded.user;
		const userToDelete = await User.findById(req.params.userId).exec();

		if (!userToDelete) {
			throw new Error("CastError");
		}

		if (userToDelete.id.toString() !== user._id) {
			throw new Error("Unauthorized");
		}

		await User.deleteOne({ _id: req.params.userId });
		res.sendStatus(200);
	} catch (error) {
		if (
			error.name === "JsonWebTokenError" ||
			error.name === "TokenExpiredError"
		) {
			res.status(403).json("Invalid or expired token.");
		} else if (error.message === "Unauthorized") {
			res.status(403).json("User is not authorized to delete.");
		} else if (error.name === "CastError") {
			res.status(404).json("User not found.");
		} else {
			res.status(500).json("Internal server error.");
		}
	}
});

userController.postLogin = [
	body("username")
		.trim()
		.notEmpty()
		.escape()
		.withMessage("Username must not be empty."),
	body("password")
		.trim()
		.notEmpty()
		.escape()
		.withMessage("Password must not be empty."),
	asyncHandler(async (req, res, next) => {
		try {
			const user = await User.findOne({
				username: req.body.username,
			}).exec();

			const match = await bcrypt.compare(
				req.body.password,
				user.password
			);

			if (!user || !match) throw new Error("CastError");

			const token = jwtUtil.generateWebToken(user);
			const { password, ...userData } = user.toObject();
			res.status(200).json({ data: { token, user: userData } });
		} catch (error) {
			if (
				error.name === "JsonWebTokenError" ||
				error.name === "TokenExpiredError"
			) {
				res.status(403).json("Invalid or expired token.");
			} else if (error.name === "CastError") {
				res.status(401).json("Invalid username or password.");
			} else {
				res.status(500).json("Internal server error.");
			}
		}
	}),
];

userController.getUserBlogPosts = asyncHandler(async (req, res, next) => {
	try {
		const decoded = await jwtUtil.verifyWebToken(req.token);
		const tokenUser = decoded.user;
		const user = await User.findById(req.params.userId);

		if (!user) res.status(404).json("User not found.");

		if (user.username !== tokenUser.username)
			throw new Error("Unauthorized");

		const blogPosts = await blogPost
			.find({ user: user.id })
			.populate("user", "username")
			.exec();
		res.status(200).json({ data: blogPosts });
	} catch (error) {
		if (
			error.name === "JsonWebTokenError" ||
			error.name === "TokenExpiredError"
		) {
			res.status(403).json("Invalid or expired token.");
		} else if (error.message === "Unauthorized") {
			res.status(403).json(
				"User is not authorized to read this user's posts."
			);
		} else {
			res.status(500).json("Internal server error.");
		}
	}
});

module.exports = userController;
