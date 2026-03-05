import express from "express";
import { checkAuthentication } from "../middlewares/authentication";
const router = express.Router();

// TODO: actually clear cookie server side
router.get("/logout", checkAuthentication, async (req, res) => {
	res.clearCookie("username");
	res.clearCookie("token");
	res.redirect("/");
});

export { router };
