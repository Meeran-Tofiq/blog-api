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
	});

	describe("GET", () => {
		it("should give a 403 error if user not logged in", async () => {
			await request(app)
				.get(baseUrl + "/" + users[0]._id.toString())
				.expect(403);
		});
	});
});
