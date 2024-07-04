const { users } = require("../__mocks__/users.mock");
const request = require("supertest");
const app = require("../jest.setup");

const baseUrl = "/api/users";

describe("Users route", () => {
	describe("GET", () => {
		it("should give a 403 error if user not logged in", async () => {
			await request(app)
				.get(baseUrl + "/" + users[0]._id.toString())
				.expect(403);
		});
	});
});
