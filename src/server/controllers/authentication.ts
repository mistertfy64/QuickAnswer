import { User } from "../models/User";
import { Request, Response, NextFunction } from "express";
import log from "../utilities/log";
import { randomBytes } from "crypto";

const register = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { username, password } = req.body;
		const user = await User.create({
			username,
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
			msg: "Email or password missing.",
		});
	}

	const user = await User.findOne({ email: username }).select("+password");

	if (!user) {
		return res.status(400).json({ success: false, msg: "Invalid credentials" });
	}

	const correctPassword = await user.checkPassword(password);

	if (!correctPassword) {
		return res.status(400).json({ success: false, msg: "Invalid credentials" });
	}

	log.info(`User ${username} logged in.`);

	const token = randomBytes(24).toString("hex");
	await user.addToken(token);

	sendTokenResponse(res, token);
};

function sendTokenResponse(res: Response, token: string) {
	res.cookie("token", token, {
		sameSite: "lax",
	});
	res.status(200).json({ success: true });
}

export { register, login };
