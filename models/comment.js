const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema(
	{
		user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
		blogPost: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "BlogPost",
		},
		content: { type: String, required: true },
		date: { type: Date, required: true, default: Date.now() },
	},
	{
		virtuals: {
			formattedDate: {
				get() {
					return DateTime.fromJSDate(this.due_back).toLocaleString(
						DateTime.DATETIME_MED
					);
				},
			},
		},
	}
);

module.exports = mongoose.model("Comment", Comment);
