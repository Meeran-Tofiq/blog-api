const BlogPost = require("../models/blogPost");

let blogPostData = [
	{
		user: 1,
		title: "title 1",
		content: "content 1",
		id: 1,
	},
	{
		user: 2,
		title: "title 1",
		content: "content 1",
		id: 2,
	},
	{
		user: 3,
		title: "title 1",
		content: "content 1",
		id: 3,
	},
];

let blogPosts = [];

async function createBlogPost(data) {
	const bp = new BlogPost(data);
	await bp.save();
	blogPosts.push(bp);
}

async function createBlogPostMocks() {
	blogPostData.forEach(async (data) => await createBlogPost(data));
}

module.exports = { createBlogPostMocks, blogPosts };
