import { User } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { sha256 } from "../utilities/sha256";
import log from "../utilities/log";

async function restrictToAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const username = req.body["username"];
	const token = req.body["token"];

	if (!username || !token) {
		log.warn(`Unauthenticated user tried to access restricted route.`);
		res.status(401).json({ success: false });
		return;
	}

	const user = await User.findOne({ username: username.toLowerCase() });

	if (!user || !user.tokens) {
		log.warn(`Unauthenticated user tried to access restricted route.`);
		res.status(401).json({ success: false });
		return;
	}

	let tokenResult = false;
	const hashed = sha256(token);

	const tokens = user.tokens;

	for (const userToken of tokens) {
		if (hashed === userToken) {
			tokenResult = true;
			break;
		}
	}

	if (!tokenResult) {
		log.warn(`Unauthenticated user tried to access restricted route.`);
		res.status(401).json({ success: false });
		return;
	}

	req.authentication = {
		loggedIn: true,
		username: username.toLowerCase(),
		isAdministrator: user.isAdministrator ?? false,
	};
	next();
}

export { restrictToAuthenticated };
