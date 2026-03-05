import express from "express";
import { checkAuthentication } from "../middlewares/authentication";
const router = express.Router();

router.get("/", checkAuthentication, async (req, res) => {
	const fetchResponse = await fetch(
		process.env.API_BASE_URL + `/api/questions`,
	);
	const data = await fetchResponse.json();

	res.render("pages/index.ejs", {
		data: data,
		authenticationData: req.authentication,
	});
});

export { router };
