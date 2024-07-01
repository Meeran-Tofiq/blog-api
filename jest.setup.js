const request = require("supertest");
const mongoose = require("mongoose");
const {
	initializeMongoServer,
	disconnectMongoServer,
} = require("./mongoTesting.config");
const apiRouter = require("./routes/api");
const { extractToken } = require("./util/jwtUtil");
const express = require("express");

let app;

beforeAll(async () => {
	await initializeMongoServer();

	app = express();
	app.use(express.urlencoded({ extended: false }));
	app.use(express.json()); // Add this if you need JSON parsing
	app.use(extractToken);
	app.use("/api", apiRouter);
});

afterAll(async () => {
	await disconnectMongoServer();
});

module.exports = app;
