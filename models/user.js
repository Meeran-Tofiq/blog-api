const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
	username: { type: String, required: true, minLength: 5 },
	password: { type: String, required: true, minLength: 12 },
	canPost: { type: Boolean, required: true },
});

module.exports = mongoose.model("User", User);
