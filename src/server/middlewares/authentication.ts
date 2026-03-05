import { User } from "../models/User";
import { sha256 } from "../utilities/sha256";

async function isAuthenticated(username: string, token: string) {
	const NOT_GOOD = {
		ok: false,
		username: null,
		isAdministrator: false,
	};

	if (!username || !token) {
		return NOT_GOOD;
	}

	const user = await User.findOne({ username: username.toLowerCase() });

	if (!user || !user.tokens) {
		return NOT_GOOD;
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
		return NOT_GOOD;
	}

	return {
		ok: true,
		username: user.username,
		isAdministrator: user.isAdministrator ?? false,
	};
}

export { isAuthenticated };
