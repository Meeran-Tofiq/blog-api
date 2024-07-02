const mongoose = require("mongoose");
const BlogPost = require("../models/blogPost");
const { users } = require("./users.mock");

let blogPostData = [];
let blogPosts = [];

function initializeData() {
	blogPostData = [
		{
			_id: new mongoose.Types.ObjectId(),
			user: users[0]._id,
			title: "title 1",
			content: "content 1",
		},
		{
			_id: new mongoose.Types.ObjectId(),
			user: users[1]._id,
			title: "title 2",
			content: "content 2",
		},
		{
			_id: new mongoose.Types.ObjectId(),
			user: users[2]._id,
			title: "title 3",
			content: "content 3",
		},
	];
}

async function createBlogPost(data) {
	const bp = new BlogPost(data);
	await bp.save();
	blogPosts.push(bp);
}

async function createBlogPostMocks() {
	initializeData();
	for (const data of blogPostData) {
		await createBlogPost(data);
	}
}

module.exports = { createBlogPostMocks, blogPosts };
