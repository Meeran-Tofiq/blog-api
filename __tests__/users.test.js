const { users } = require("../__mocks__/users.mock");
const apiRouter = require("../routes/api");
const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/api", apiRouter);

const baseUrl = "/api/users";

describe("Users route", () => {
	describe("GET", () => {
		it("should return all users, if a user is not specified", async () => {
			request(app)
				.get(baseUrl)
				.expect("Content-Type", /json/)
				.expect({ data: users })
				.expect(200);
		});
	});
});
