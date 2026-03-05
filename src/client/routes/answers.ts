import express from "express";
import { checkAuthentication } from "../middlewares/authentication";
const router = express.Router();

router.post("/answers", checkAuthentication, async (req, res) => {
	const fetchResponse = await fetch(process.env.API_BASE_URL + `/api/answers`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			content: req.body.answer,
			question: req.body.question,
			username: req.authentication.username,
			token: req.cookies["token"],
		}),
	});

	res.redirect(`/questions/${req.body.question}`);
});

export { router };
