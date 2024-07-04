const { users, userMockData } = require("../__mocks__/users.mock");
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
				.set({ authorization: `bearer ${token}` })
				.expect(200)
				.expect("Content-Type", /json/)
				.expect((res) => res.body.data.username === username);
		});
	});
});
