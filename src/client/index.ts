import express from "express";
import log from "./utilities/log";
import path from "path";
import cookieParser from "cookie-parser";
require("@dotenvx/dotenvx").config();

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "client/views"));
app.use(express.static(path.join(__dirname, "..", "client/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

declare global {
	namespace Express {
		interface Request {
			authentication: {
				loggedIn: boolean;
				username: string;
				isAdministrator: boolean;
			};
		}
	}
}

require("fs")
	.readdirSync(require("path").join(__dirname, "./routes"))
	.filter((file: string) => file.endsWith(".ts") || file.endsWith(".js"))
	.forEach((file: string) => {
		app.use(require("./routes/" + file).router);
	});

const PORT = process.env.FRONTEND_PORT || 4000;

const server = app.listen(
	PORT,
	log.info("Server running in", process.env.NODE_ENV, "mode on port", PORT),
);
