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

async function createBlogPost(data) {
	const bp = new BlogPost(data);
	await bp.save();
}

async function createBlogPostMocks() {
	for (const data in blogPostData) {
		await createBlogPost(data);
	}
}

module.exports = createBlogPostMocks;
