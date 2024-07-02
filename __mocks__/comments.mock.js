const mongoose = require("mongoose");
const Comment = require("../models/comment");
const { users } = require("./users.mock");
const { blogPosts } = require("./blogPosts.mock");

let commentData = [];
let comments = [];

function initializeData() {
	commentData = [
		{
			_id: new mongoose.Types.ObjectId(),
			blogPost: blogPosts[0]._id,
			user: users[0]._id,
			content: "comment from 3 to 1",
		},
		{
			_id: new mongoose.Types.ObjectId(),
			blogPost: blogPosts[1]._id,
			user: users[0]._id,
			content: "comment from 1 to 2",
		},
		{
			_id: new mongoose.Types.ObjectId(),
			blogPost: blogPosts[2]._id,
			user: users[0]._id,
			content: "comment from 2 to 3",
		},
	];
}

async function createComment(data) {
	const cm = new Comment(data);
	await cm.save();
	comments.push(cm);
}

async function createCommentMocks() {
	initializeData();
	for (const data of commentData) {
		await createComment(data);
	}
}

module.exports = { createCommentMocks, comments };
