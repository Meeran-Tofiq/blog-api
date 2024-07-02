const { blogPosts } = require("../__mocks__/blogPosts.mock");
const apiRouter = require("../routes/api");
const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/api", apiRouter);

const baseUrl = "/api/blog-posts";

describe("Blog Posts route", () => {
	describe("GET", () => {
		it("should return all blog posts, if a blog post is not specified", async () => {
			request(app)
				.get(baseUrl)
				.expect("Content-Type", /json/)
				.expect({ data: blogPosts })
				.expect(200);
		});
	});
});
