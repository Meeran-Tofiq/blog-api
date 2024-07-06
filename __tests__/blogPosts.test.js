const { blogPosts } = require("../__mocks__/blogPosts.mock");
const { users, userMockData } = require("../__mocks__/users.mock");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../jest.setup");
const blogPost = require("../models/blogPost");

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

	describe("POST", () => {
		it("should allow a user that has the ability to post, to post", async () => {
			const blogPost = {
				title: "This is some title",
				content: "This is some content",
				isPublished: true,
			};
			const [username, password] = [
				users[2].username,
				userMockData[2].password,
			];
			const loginRes = await request(app)
				.post("/api/users/login")
				.type("form")
				.send({
					username,
					password,
				})
				.expect(200);
			let token = await loginRes.body.data.token;

			await request(app)
				.post(baseUrl)
				.set("Authorization", `Bearer ${token}`)
				.type("form")
				.send(blogPost)
				.expect(200);

			await request(app)
				.get(baseUrl)
				.expect(200)
				.then((res) => {
					const createdPost = res.body.data.find(
						(post) =>
							post.title === blogPost.title &&
							post.content === blogPost.content
					);

					expect(createdPost).toBeDefined();
				});
		});

		it("should not allow a user without the ability to post, to post", async () => {
			const blogPost = {
				title: "This is some title",
				content: "This is some content",
				isPublished: true,
			};

			await request(app).post(baseUrl).send(blogPost).expect(403);
		});
	});

	describe("PUT", () => {
		it("should not allow a user that hasn't logged in to edit a blog post", async () => {
			await request(app)
				.put(baseUrl + `/${blogPosts[0]._id.toString()}`)
				.type("from")
				.send({ content: "New content babyyyy" })
				.expect(403);
		});

		it("should not allow a user, even if signed in, to edit another user's post", async () => {
			const newContent = "New content babyyyy";
			const [username, password] = [
				users[2].username,
				userMockData[2].password,
			];
			const loginRes = await request(app)
				.post("/api/users/login")
				.type("form")
				.send({
					username,
					password,
				})
				.expect(200);
			let token = await loginRes.body.data.token;

			await request(app)
				.put(baseUrl + `/${blogPosts[0]._id.toString()}`)
				.set("Authorization", `Bearer ${token}`)
				.type("from")
				.send({ content: newContent })
				.expect(403);
		});

		it("should allow the creator of the blog post, if signed in, to edit their post", async () => {
			const newContent = "New content babyyyy";
			const [username, password] = [
				users[2].username,
				userMockData[2].password,
			];
			const loginRes = await request(app)
				.post("/api/users/login")
				.type("form")
				.send({
					username,
					password,
				})
				.expect(200);
			let token = await loginRes.body.data.token;

			await request(app)
				.put(baseUrl + `/${blogPosts[2]._id.toString()}`)
				.set("Authorization", `Bearer ${token}`)
				.type("from")
				.send({ content: newContent })
				.expect(200);

			await request(app)
				.get(baseUrl + `/${blogPosts[2]._id.toString()}`)
				.expect(200)
				.then((res) =>
					expect(res.body.data.content).toEqual(newContent)
				);
		});
	});
});
