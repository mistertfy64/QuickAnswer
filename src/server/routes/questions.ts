import express from "express";
import {
	addQuestion,
	getQuestion,
	getQuestions,
	markQuestionAsSolved,
} from "../controllers/questions";
import { restrictToAuthenticated } from "../middlewares/authentication";

const router = express.Router();

router.get("/", getQuestions);
router.get("/:id", getQuestion);
router.post("/", restrictToAuthenticated, addQuestion);
router.put("/:id", restrictToAuthenticated, markQuestionAsSolved);

module.exports = router;
