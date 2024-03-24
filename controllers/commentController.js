const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

let commentController = {};

commentController.postComment = asyncHandler((req, res, next) => {});

commentController.getComment = asyncHandler((req, res, next) => {});

commentController.putComment = asyncHandler((req, res, next) => {});

commentController.deleteComment = asyncHandler((req, res, next) => {});

module.exports = commentController;
