const jwt = require("jsonwebtoken");

function generateWebToken(user) {
	return jwt.sign({ user }, process.env.JWT_SECRET);
}

async function verifyWebToken(token) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				reject(err);
			} else {
				resolve(decoded);
			}
		});
	});
}

module.exports = { generateWebToken, verifyWebToken };
