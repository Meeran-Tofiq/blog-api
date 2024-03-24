const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

let userController = {};

userController.postUser = asyncHandler((req, res, next) => {});

userController.getUser = asyncHandler((req, res, next) => {});

userController.putUser = asyncHandler((req, res, next) => {});

userController.deleteUser = asyncHandler((req, res, next) => {});

module.exports = userController;
