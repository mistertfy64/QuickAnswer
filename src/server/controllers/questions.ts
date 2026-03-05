import { Question } from "../models/Question";
import { Request, Response, NextFunction } from "express";
import log from "../utilities/log";

const addQuestion = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { title, content } = req.body;

		if (!title || !content) {
			res.status(400).json({ success: false });
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

const getQuestion = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const question = await Question.findById(req.params.id);

		if (!question) {
			res.status(404).json({ success: false });
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

export { addQuestion, getQuestion };
