const { users, userMockData } = require("../__mocks__/users.mock");
const { blogPosts } = require("../__mocks__/blogPosts.mock");
const request = require("supertest");
const app = require("../jest.setup");

const baseUrl = "/api/users";

describe("Users route", () => {
	describe("POST", () => {
		it("should return a JWT token, on successful login", async () => {
			const [username, password] = [
				users[0].username,
				userMockData[0].password,
			];
			await request(app)
				.post(baseUrl + "/login")
				.type("form")
				.send({
					username,
					password,
				})
				.expect(200)
				.expect("Content-Type", /json/);
		});

		it("should create a new user when provided with adequate info", async () => {
			const data = {
				username: "newUser",
				password: "Pa55word1976%",
				passwordConfirmation: "Pa55word1976%",
				canPost: false,
			};

			await request(app)
				.post(baseUrl)
				.type("form")
				.send(data)
				.expect(200)
				.expect("Content-Type", /json/);
		});
	});

	describe("GET", () => {
		it("should give a 403 error if user not logged in", async () => {
			await request(app)
				.get(baseUrl + "/" + users[0]._id.toString())
				.expect(403);
		});

		it("should get user data if logged in", async () => {
			const [username, password] = [
				users[0].username,
				userMockData[0].password,
			];
			const loginRes = await request(app)
				.post(baseUrl + "/login")
				.type("form")
				.send({
					username,
					password,
				});
			const token = await loginRes.body.data.token;

			const response = await request(app)
				.get(baseUrl + "/" + users[0]._id.toString())
				.set("authorization", `Bearer ${token}`)
				.expect(200)
				.expect("Content-Type", /json/)
				.expect((res) => res.body.data.username === username);
		});

		it("should return a user's blog posts", async () => {
			const [username, password] = [
				users[0].username,
				userMockData[0].password,
			];
			const loginRes = await request(app)
				.post(baseUrl + "/login")
				.type("form")
				.send({
					username,
					password,
				});
			const token = await loginRes.body.data.token;

			const response = await request(app)
				.get(baseUrl + `/${users[0]._id.toString()}/blog-posts`)
				.set("authorization", `Bearer ${token}`)
				.expect(200);

			const userId = users[0]._id.toString();

			response.body.data.forEach((post) => {
				expect(post.user._id).toEqual(userId);
			});
		});
	});

	describe("PUT", () => {
		it("should give a 403 error, if user not logged in", async () => {
			await request(app)
				.put(baseUrl + `/${users[0]._id.toString()}`)
				.send({ username: "What?????" })
				.expect(403);
		});

		it("should allow you to change information when logged in", async () => {
			const expectedUsername = "What????";
			const [username, password] = [
				users[0].username,
				userMockData[0].password,
			];
			const loginRes = await request(app)
				.post(baseUrl + "/login")
				.type("form")
				.send({
					username,
					password,
				})
				.expect(200);
			let token = await loginRes.body.data.token;

			const response = await request(app)
				.put(baseUrl + `/${users[0]._id.toString()}`)
				.set("Authorization", `Bearer ${token}`)
				.send({ username: expectedUsername })
				.expect(200);

			token = response.body.data;

			await request(app)
				.get(baseUrl + `/${users[0]._id.toString()}`)
				.set("Authorization", `Bearer ${token}`)
				.expect(200)
				.expect("Content-Type", /json/)
				.expect((res) => res.body.data.username === username);
		});
	});

	describe("DELETE", () => {
		it("should not allow it if user is not logged in, and throw a 403", async () => {
			await request(app)
				.delete(baseUrl + `/${users[0]._id.toString()}`)
				.expect(403);
		});

		it("should allow a delete if user is logged in", async () => {
			const [username, password] = [
				users[1].username,
				userMockData[1].password,
			];
			const loginRes = await request(app)
				.post(baseUrl + "/login")
				.type("form")
				.send({
					username,
					password,
				})
				.expect(200);
			let token = await loginRes.body.data.token;

			await request(app)
				.delete(baseUrl + `/${users[1]._id.toString()}`)
				.set("Authorization", `Bearer ${token}`)
				.expect(200);

			await request(app)
				.get(baseUrl + `/${users[1]._id.toString()}`)
				.set("Authorization", `Bearer ${token}`)
				.expect(404);
		});
	});
});
