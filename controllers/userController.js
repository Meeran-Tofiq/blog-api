const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwtUtil = require("../util/jwtUtil");
const bcrypt = require("bcryptjs");

let userController = {};

userController.postUser = asyncHandler((req, res, next) => {});

userController.getUser = asyncHandler((req, res, next) => {});

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

			res.status(200).json(jwtUtil.generateWebToken(user));
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
