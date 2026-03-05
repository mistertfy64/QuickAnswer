import express from "express";
import { checkAuthentication } from "../middlewares/authentication";
const router = express.Router();

router.get("/questions/:id", checkAuthentication, async (req, res) => {
	const fetchResponse = await fetch(
		process.env.API_BASE_URL + `/api/questions/${req.params.id}`,
	);
	const data = await fetchResponse.json();
	res.render("pages/question.ejs", {
		data: data,
		authenticationData: req.authentication,
	});
});

export { router };
