const { comments } = require("../__mocks__/comments.mock");
const { blogPosts } = require("../__mocks__/blogPosts.mock");
const request = require("supertest");
const app = require("../jest.setup");

const baseUrl = (blogPostId) => `/api/blog-posts/${blogPostId}/comments`;

describe("Comments route", () => {
	describe("GET", () => {
		it("should return all comments, if a comment is not specified", async () => {
			const blogPostId = blogPosts[0]._id.toString();

			const response = await request(app)
				.get(baseUrl(blogPostId))
				.expect("Content-Type", /json/)
				.expect(200);

			const responseBody = response.body.data.map((comment) => ({
				_id: comment._id.toString(),
				user: {
					_id: comment.user._id.toString(),
				},
				blogPost: comment.blogPost.toString(),
				content: comment.content,
				date: new Date(comment.date).toISOString(),
				isEdited: comment.isEdited,
				__v: comment.__v,
			}));

			const expectedBody = comments
				.filter((comment) => comment.blogPost.toString() === blogPostId)
				.map((comment) => ({
					_id: comment._id.toString(),
					user: {
						_id: comment.user.toString(),
					},
					blogPost: comment.blogPost.toString(),
					content: comment.content,
					date: comment.date.toISOString(),
					isEdited: comment.isEdited,
					__v: comment.__v,
				}));

			expect(responseBody).toEqual(expectedBody);
		});

		it("should return a specific comment when the url has specified it", async () => {
			const blogPostId = blogPosts[0]._id.toString();
			const commentId = comments[0]._id.toString();

			const response = await request(app)
				.get(baseUrl(blogPostId) + `/${commentId}`)
				.expect(200);

			const data = response.body.data;
			const resBody = {
				_id: data._id.toString(),
				user: {
					_id: data.user._id.toString(),
				},
				blogPost: data.blogPost.toString(),
				content: data.content,
				date: new Date(data.date).toISOString(),
				isEdited: data.isEdited,
				__v: data.__v,
			};

			const comment = comments[0];
			const expectedBody = {
				_id: comment._id.toString(),
				user: {
					_id: comment.user.toString(),
				},
				blogPost: comment.blogPost.toString(),
				content: comment.content,
				date: comment.date.toISOString(),
				isEdited: comment.isEdited,
				__v: comment.__v,
			};

			expect(resBody).toEqual(expectedBody);
		});
	});
});
