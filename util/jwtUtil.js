const jwt = require("jsonwebtoken");

function extractToken(req, res, next) {
	const bearerHeader = req.headers.authorization;

	if (bearerHeader) {
		const bearer = bearerHeader.split(" ");
		const token = bearer[1];
		req.token = token;
		next();
	}
}

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

module.exports = { extractToken, generateWebToken, verifyWebToken };
