const Comment = require("../models/comment");

const commentData = [
	{
		_id: 1,
		blogPost: 1,
		user: 3,
		content: "comment from 3 to 1",
	},
	{
		_id: 2,
		blogPost: 2,
		user: 1,
		content: "comment from 1 to 2",
	},
	{
		_id: 3,
		blogPost: 3,
		user: 2,
		content: "comment from 2 to 3",
	},
];

const comments = [];

async function createComment(data) {
	const cm = new Comment(data);
	await cm.save();
	comments.push(cm);
}

async function createCommentMocks() {
	for (const data in commentData) {
		await createComment(data);
	}
}

module.exports = { createCommentMocks, comments };
