const bcrypt = require("bcryptjs");
const User = require("../models/user");

const UserData = [
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
	bcrypt.hash(data.password, 10, async (err, hash) => {
		if (err) throw new Error(err);

		const user = new User({
			...data,
			password: hash,
		});

		await user.save();
		users.push(user);
	});
}

async function createUserMocks() {
	for (const data in UserData) {
		await createUser(data);
	}
}

module.exports = { createUserMocks, users };
