const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/user");

const userMockData = [
	{
		_id: new mongoose.Types.ObjectId(),
		username: "hello",
		password: "hello",
		canPost: false,
	},
	{
		_id: new mongoose.Types.ObjectId(),
		username: "wazzap",
		password: "wazzap",
		canPost: false,
	},
	{
		_id: new mongoose.Types.ObjectId(),
		username: "byebye",
		password: "byebye",
		canPost: true,
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
	for (const data of userMockData) {
		await createUser(data);
	}
}

module.exports = { createUserMocks, users, userMockData };
