import express from "express";
import { checkAuthentication } from "../middlewares/authentication";
const router = express.Router();

interface AddQuestionResponseInterface {
	success: boolean;
	questionID: string;
}

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

router.get("/questions/:id/solved", checkAuthentication, async (req, res) => {
	const fetchResponse = await fetch(
		process.env.API_BASE_URL + `/api/questions/${req.params.id}`,
		{
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				solved: true,
				username: req.authentication.username,
				token: req.cookies["token"],
			}),
		},
	);
	res.redirect(`/questions/${req.params.id}`);
});

router.post("/questions", checkAuthentication, async (req, res) => {
	if (!req.authentication.loggedIn) {
		res.redirect("/");
	}

	const addQuestionFetchResponse = await fetch(
		process.env.API_BASE_URL + `/api/questions`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				content: req.body.content,
				title: req.body.title,
				username: req.authentication.username,
				token: req.cookies["token"],
			}),
		},
	);

	const addQuestionData =
		(await addQuestionFetchResponse.json()) as AddQuestionResponseInterface;

	if (!addQuestionData.success) {
		res.redirect("/");
	}

	res.redirect(`/questions/${addQuestionData.questionID}`);
});

export { router };
