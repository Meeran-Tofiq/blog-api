const bcrypt = require("bcryptjs");
const User = require("../models/user");

const userData = [
	{
		_id: 1,
		username: "hello",
		password: "hello",
		canPost: false,
	},
	{
		_id: 2,
		username: "wazzap",
		password: "wazzap",
		canPost: false,
	},
	{
		_id: 3,
		username: "bye",
		password: "bye",
		canPost: false,
	},
];

let users = [];

async function createUser(data) {
	try {
		const hash = await bcrypt.hash(data.password, 10);
		const user = new User({
			...data,
			password: hash,
		});
		await user.save();
		users.push(user);
	} catch (err) {
		throw new Error(err);
	}
}

async function createUserMocks() {
	userData.forEach(async (data) => await createUser(data));
}

module.exports = { createUserMocks, users };
