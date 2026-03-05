import express from "express";
import { checkAuthentication } from "../middlewares/authentication";
const router = express.Router();

router.get("/new", checkAuthentication, async (req, res) => {
	if (!req.authentication.loggedIn) {
		res.redirect("/login");
		return;
	}

	res.render("pages/new.ejs", {
		authenticationData: req.authentication,
	});
});

export { router };
