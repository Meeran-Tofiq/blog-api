const BlogPost = require("../models/blogPost");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

let blogPostController = {};

blogPostController.postBlogPost = asyncHandler((req, res, next) => {});

blogPostController.getBlogPost = asyncHandler((req, res, next) => {});

blogPostController.putBlogPost = asyncHandler((req, res, next) => {});

blogPostController.deleteBlogPost = asyncHandler((req, res, next) => {});

module.exports = blogPostController;
