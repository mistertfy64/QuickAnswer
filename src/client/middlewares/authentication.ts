import { Request, Response, NextFunction } from "express";

interface AdministratorUserInterface {
	authenticated: boolean;
	username: string;
	isAdministrator: boolean;
}

const checkAuthentication = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	//TODO: ???
	const authenticationFetchResponse = await fetch(
		process.env.API_BASE_URL + `/api/authentication/me`,
		{
			method: "GET",
			credentials: "include",
			headers: {
				"Cookie":
					`username=${req.cookies.username}` +
					`;` +
					`token=${req.cookies.token}`,
			},
		},
	);

	const authenticationData =
		(await authenticationFetchResponse.json()) as AdministratorUserInterface;

	if (!authenticationData) {
		req.authentication = {
			loggedIn: false,
			username: "",
			isAdministrator: false,
		};
		next();
		return;
	}

	req.authentication = {
		loggedIn: authenticationData.authenticated,
		username: authenticationData.username,
		isAdministrator: authenticationData.isAdministrator,
	};

	next();
};

export { checkAuthentication };
