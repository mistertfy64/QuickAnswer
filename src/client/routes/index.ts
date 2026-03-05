import express from "express";
import { checkAuthentication } from "../middlewares/authentication";
const router = express.Router();

interface QuestionResponseInterface {
	success: boolean;
	questions: Array<{ [key: string]: unknown }>;
}

router.get("/", checkAuthentication, async (req, res) => {
	const unsolvedQuestionResponse = await fetch(
		process.env.API_BASE_URL + `/api/questions?solved=0`,
	);

	const unsolvedQuestions =
		(await unsolvedQuestionResponse.json()) as QuestionResponseInterface;

	const solvedQuestionResponse = await fetch(
		process.env.API_BASE_URL + `/api/questions?solved=1`,
	);

	const solvedQuestions =
		(await solvedQuestionResponse.json()) as QuestionResponseInterface;

	const data = {
		unsolvedQuestions: unsolvedQuestions.questions,
		solvedQuestions: solvedQuestions.questions,
	};

	res.render("pages/index.ejs", {
		data: data,
		authenticationData: req.authentication,
	});
});

export { router };
