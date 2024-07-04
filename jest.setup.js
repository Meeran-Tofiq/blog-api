require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const {
	initializeMongoServer,
	disconnectMongoServer,
} = require("./mongoTesting.config");
const apiRouter = require("./routes/api");
const { extractToken } = require("./util/jwtUtil");
const express = require("express");
const { createUserMocks } = require("./__mocks__/users.mock");
const { createBlogPostMocks } = require("./__mocks__/blogPosts.mock");
const { createCommentMocks } = require("./__mocks__/comments.mock");

const app = express();

beforeAll(async () => {
	await initializeMongoServer();

	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());
	app.use(extractToken);
	app.use("/api", apiRouter);

	await createUserMocks();
	await createBlogPostMocks();
	await createCommentMocks();
});

afterAll(async () => {
	await disconnectMongoServer();
});

module.exports = app;
