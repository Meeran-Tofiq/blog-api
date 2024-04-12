require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 50,
});

var apiRouter = require("./routes/api");
const { extractToken } = require("./util/jwtUtil");

var app = express();

main().catch((err) => console.log(err));
async function main() {
	await mongoose.connect(process.env.MONGODB_URI);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(compression());
app.use(limiter);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(extractToken);

app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	let error = req.app.get("env") === "development" ? err : {};
	res.status(err.status || 500).json(error);
});

module.exports = app;
