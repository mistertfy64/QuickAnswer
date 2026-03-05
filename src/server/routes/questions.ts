import express from "express";
import {
	addQuestion,
	getQuestion,
	getQuestions,
} from "../controllers/questions";
import { restrictToAuthenticated } from "../middlewares/authentication";

const router = express.Router();

router.get("/", getQuestions);
router.get("/:id", getQuestion);
router.post("/", restrictToAuthenticated, addQuestion);

module.exports = router;
