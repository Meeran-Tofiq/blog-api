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

		it("should return a specific blog post, if it's available in the DB", async () => {
			const response = await request(app)
				.get(baseUrl + `/${blogPosts[0]._id.toString()}`)
				.expect(200)
				.expect("Content-Type", /json/);

			const blogPost = response.body.data;
			const responseBody = {
				...blogPost,
				_id: blogPost._id.toString(),
				date: new Date(blogPost.date),
				user: blogPost.user._id.toString(),
			};

			const expectedBody = {
				_id: blogPosts[0]._id.toString(),
				user: blogPosts[0].user.toString(),
				title: blogPosts[0].title,
				content: blogPosts[0].content,
				date: blogPosts[0].date,
				__v: blogPosts[0].__v,
			};

			expect(responseBody).toEqual(expectedBody);
		});

		it("should return a 404 error when a specified blog post doesn't exist", async () => {
			const response = await request(app)
				.get(baseUrl + "/0909")
				.expect(404);
		});
	});
});
