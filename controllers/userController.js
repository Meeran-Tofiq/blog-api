const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

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
		const user = await User.find({
			username: req.body.username,
			password: req.body.password,
		}).exec();

		if (!user) {
			res.status(401).send("Invalid username or password.");
		}

		res.json(generateWebToken(user));
	}),
];

function generateWebToken(user) {
	return jwt.sign({ user }, process.env.JWT_SECRET);
}

module.exports = userController;
