const { blogPosts } = require("../__mocks__/blogPosts.mock");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../jest.setup");

const baseUrl = "/api/blog-posts";

describe("Blog Posts route", () => {
	describe("GET", () => {
		it("should return all blog posts, if a blog post is not specified", async () => {
			const response = await request(app)
				.get(baseUrl)
				.expect("Content-Type", /json/)
				.expect(200);

			const responseBody = response.body.data.map((post) => ({
				...post,
				_id: post._id.toString(),
				date: new Date(post.date),
				user: post.user._id.toString(),
			}));

			const expectedBody = blogPosts.map((post) => ({
				_id: post._id.toString(),
				user: post.user.toString(),
				title: post.title,
				content: post.content,
				date: post.date,
				__v: post.__v,
			}));

			expect(responseBody).toEqual(expectedBody);
		});
	});
});
