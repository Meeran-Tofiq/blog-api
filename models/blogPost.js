const { DateTime } = require("luxon");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogPost = new Schema(
	{
		user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
		title: { type: String, required: true, minLength: 3 },
		content: { type: String, required: true, minLength: 3 },
		date: { type: Date, required: true, default: Date.now() },
		isPublished: { type: Boolean, rquired: true },
	},
	{
		virtuals: {
			date: {
				get() {
					return DateTime.fromJSDate(this.due_back).toLocaleString(
						DateTime.DATETIME_MED
					);
				},
			},
		},
	}
);

module.exports = mongoose.model("BlogPost", BlogPost);
