import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	creator: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

const Question = mongoose.model("Question", QuestionSchema);

export { Question };
