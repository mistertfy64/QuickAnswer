import { Answer } from "../models/Answer";
import { Request, Response, NextFunction } from "express";
import log from "../utilities/log";
import mongoose from "mongoose";
import { Question } from "../models/Question";

const addAnswer = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { content, question } = req.body;

		if (!content) {
			res.status(400).json({ success: false });
		}

		const answer = await Answer.create({
			content: content,
			question: new mongoose.Types.ObjectId(question),
			creator: req.authentication.username,
		});

		const targetQuestion = await Question.findById(question);

		if (!targetQuestion) {
			res.status(400).json({ success: false });
			return;
		}

		targetQuestion.addAnswer(answer._id);

		log.info(`Added answer to question with ID ${question}`);

		res.status(200).json({
			success: true,
		});
	} catch (error: unknown) {
		res.status(400).json({ success: false });
		if (error instanceof Error) {
			log.error(error.stack);
		}
	}
};

export { addAnswer };
