const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
	res.send("COMMENT: respond with a resource");
});

module.exports = router;
