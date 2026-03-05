import { Answer } from "../models/Answer";
import { Request, Response, NextFunction } from "express";
import log from "../utilities/log";

const addAnswer = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { content, question } = req.body;

		if (!content) {
			res.status(400).json({ success: false });
		}

		const answer = await Answer.create({
			content: content,
			question: question,
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

export { addAnswer };
