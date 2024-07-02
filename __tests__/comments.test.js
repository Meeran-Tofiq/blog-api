const { comments } = require("../__mocks__/comments.mock");
const apiRouter = require("../routes/api");
const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/api", apiRouter);

const baseUrl = "/api/comments";

describe("Comments route", () => {
	describe("GET", () => {
		it("should return all comments, if a comment is not specified", async () => {
			request(app)
				.get(baseUrl)
				.expect("Content-Type", /json/)
				.expect({ data: comments })
				.expect(200);
		});
	});
});
