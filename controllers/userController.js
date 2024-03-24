const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwtUtil = require("../util/jwtUtil");
const bcrypt = require("bcryptjs");

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

			if (user) return false;

			return true;
		})
		.withMessage("Username is already taken."),
	body("password")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Password must not be empty."),
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
				res.status(200).json(token);
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
	const user = await User.findById(req.params.userId);

	if (!user) res.status(404).json("User not found.");

	res.json({ uesr });
});

userController.putUser = asyncHandler((req, res, next) => {});

userController.deleteUser = asyncHandler((req, res, next) => {});

userController.login = [
	body("username")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Username must not be empty."),
	body("password")
		.trim()
		.isLength({ min: 1 })
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
			res.status(200).json(token);
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

module.exports = userController;
