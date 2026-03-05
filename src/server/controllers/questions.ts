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
			createdAt: Date.now(),
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
		let solvedOnly = 0;
		let limit = 100;

		const filter: { [key: string]: number } = {};

		if (req.query.solved) {
			solvedOnly = Math.min(
				1,
				Math.max(0, parseInt(req.query.solved.toString(), 10)),
			);
			filter.solved = solvedOnly;
		}

		if (req.query.limit) {
			limit = Math.min(100, parseInt(req.query.limit.toString(), 10));
		}
		filter.limit = limit;

		const questions = await Question.find(filter)
			.select({
				title: 1,
				createdAt: 1,
				creator: 1,
				limit: limit,
			})
			.sort({ createdAt: -1 });

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
		const question = await Question.findById(req.params.id).populate({
			path: "answers",
			options: {
				sort: { createdAt: 1 },
				select: { content: 1, createdAt: 1, creator: 1 },
			},
		});

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

const markQuestionAsSolved = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const question = await Question.findById(req.params.id);

		if (!question) {
			res.status(404).json({ success: false });
			return;
		}

		if (question.creator !== req.authentication.username) {
			res.status(403).json({ success: false });
			return;
		}

		// TODO: Inconsistent
		question.solved = req.body.solved;
		question.save();

		log.info(`Marked question ${question._id} as solved`);

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

export { addQuestion, getQuestion, getQuestions, markQuestionAsSolved };
