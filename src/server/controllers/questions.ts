import { Question } from "../models/Question";
import { Request, Response, NextFunction } from "express";
import log from "../utilities/log";

const addQuestion = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { title, content } = req.body;

		if (!title || !content) {
			res.status(400).json({ success: false });
			return;
		}

		const question = await Question.create({
			title: title,
			content: content,
			creator: req.authentication.username,
		});

		res.status(200).json({
			success: true,
			questionID: question._id,
		});
	} catch (error: unknown) {
		res.status(400).json({ success: false });
		if (error instanceof Error) {
			log.error(error.stack);
		}
	}
};

const getQuestions = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const questions = await Question.find({}).select({
			title: 1,
			createdAt: 1,
			creator: 1,
		});

		res.status(200).json({
			success: true,
			questions: questions,
		});
	} catch (error: unknown) {
		res.status(400).json({ success: false });
		if (error instanceof Error) {
			log.error(error.stack);
		}
	}
};

const getQuestion = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const question = await Question.findById(req.params.id).populate("answers");

		if (!question) {
			res.status(404).json({ success: false });
			return;
		}

		res.status(200).json({
			success: true,
			question: question,
		});
	} catch (error: unknown) {
		res.status(400).json({ success: false });
		if (error instanceof Error) {
			log.error(error.stack);
		}
	}
};

export { addQuestion, getQuestion, getQuestions };
