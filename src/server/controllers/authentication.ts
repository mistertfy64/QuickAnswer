import { User } from "../models/User";
import { Request, Response, NextFunction } from "express";
import log from "../utilities/log";
import { randomBytes } from "crypto";
import { sha256 } from "../utilities/sha256";

const register = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let { username, password } = req.body;

		const user = await User.create({
			username: username.toLowerCase(),
			password,
		});
		log.info(`Added new user with username ${user.username}.`);
		res.status(200).json({ success: true });
	} catch (error: unknown) {
		res.status(400).json({ success: false });
		if (error instanceof Error) {
			log.error(error.stack);
		}
	}
};

const login = async (req: Request, res: Response, next: NextFunction) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({
			success: false,
			msg: "Username or password missing.",
		});
	}

	const user = await User.findOne({ username: username.toLowerCase() }).select(
		"+password",
	);

	if (!user) {
		return res.status(400).json({ success: false, msg: "Invalid credentials" });
	}

	const correctPassword = await user.checkPassword(password);

	if (!correctPassword) {
		return res.status(400).json({ success: false, msg: "Invalid credentials" });
	}

	log.info(`User ${username.toLowerCase()} logged in.`);

	const token = randomBytes(24).toString("hex");
	await user.addToken(token);

	sendTokenResponse(res, username.toLowerCase(), token);
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
	res.clearCookie("username");
	res.clearCookie("token");
	res.status(200).json({ success: true });
};

const me = async (req: Request, res: Response, next: NextFunction) => {
	const username = req.cookies["username"];
	const token = req.cookies["token"];

	if (!username || !token) {
		res.status(200).json({
			success: true,
			authenticated: false,
			username: null,
		});
		return;
	}

	const user = await User.findOne({ username: username.toLowerCase() });

	const hashed = sha256(token);

	if (!user) {
		res.status(200).json({
			success: true,
			authenticated: false,
			username: null,
		});
		return;
	}

	let tokenResult = false;
	const tokens = user.tokens;

	for (const userToken of tokens) {
		if (hashed === userToken) {
			tokenResult = true;
			break;
		}
	}

	if (!tokenResult) {
		res.status(200).json({
			success: true,
			authenticated: false,
			username: null,
		});
		return;
	}

	res.status(200).json({
		success: true,
		authenticated: true,
		username: user.username,
	});
};

function sendTokenResponse(res: Response, username: string, token: string) {
	res.status(200).json({ success: true, username: username, token: token });
}

export { register, login, logout, me };
