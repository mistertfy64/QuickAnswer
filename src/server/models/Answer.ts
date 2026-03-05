import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
	content: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	question: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	creator: {
		type: String,
		required: true,
	},
});

const Answer = mongoose.model("Answer", AnswerSchema);

export { Answer };
