import express from "express";
import cookieParser from "cookie-parser";
import log from "./utilities/log";
import mongoose from "mongoose";
require("@dotenvx/dotenvx").config();

declare global {
	namespace Express {
		interface Request {
			authentication: {
				username: string;
				isAdministrator: boolean;
			};
		}
	}
}

const authentication = require("./routes/authentication");
const questions = require("./routes/questions");
const answers = require("./routes/answers");

const app = express();
app.set("query parser", "extended");
app.use(express.json());
app.use(cookieParser());

const connectToDatabase = async () => {
	mongoose.set("strictQuery", true);
	const connection = await mongoose.connect(process.env.MONGO_URI || "");
	log.info(`Connected to database`);
};

connectToDatabase();

// routes
app.use(`/api/authentication`, authentication);
app.use(`/api/questions`, questions);
app.use(`/api/answers`, answers);

const PORT = process.env.PORT || 5000;

const server = app.listen(
	PORT,
	log.info("Server running in", process.env.NODE_ENV, "mode on port", PORT),
);
