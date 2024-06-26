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
		isEdited: { type: Boolean, required: true, default: false },
	},
	{
		virtuals: {
			formattedDate: {
				get() {
					return DateTime.fromJSDate(this.date).toLocaleString(
						DateTime.DATETIME_MED
					);
				},
			},
		},
	}
);

module.exports = mongoose.model("Comment", Comment);
