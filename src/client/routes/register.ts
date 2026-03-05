import express from "express";
import { checkAuthentication } from "../middlewares/authentication";
const router = express.Router();

interface AuthenticationResponse {
	success: boolean;
	username: string | null;
	token: string | null;
}

router.get("/register", checkAuthentication, async (req, res) => {
	if (req.authentication.loggedIn) {
		res.redirect("/");
		return;
	}

	res.render("pages/register.ejs", {
		authenticationData: req.authentication,
	});
});

router.post("/register", checkAuthentication, async (req, res) => {
	if (req.authentication.loggedIn) {
		res.redirect("/");
		return;
	}

	const target = process.env.API_BASE_URL + "/api/authentication/register";

	const fetchResult = await fetch(target, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			username: req.body.username,
			password: req.body.password,
		}),
	});

	const data = (await fetchResult.json()) as AuthenticationResponse;

	if (!data.success) {
		res.redirect("/login");
		return;
	}

	res.cookie("username", data.username, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 24 * 60 * 60 * 1000, // 24 hours
		sameSite: process.env.NODE_ENV === "production" ? "strict" : undefined,
	});

	res.cookie("token", data.token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 24 * 60 * 60 * 1000, // 24 hours
		sameSite: process.env.NODE_ENV === "production" ? "strict" : undefined,
	});

	res.redirect("/");
});

export { router };
