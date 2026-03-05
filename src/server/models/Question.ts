import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
	{
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
		answers: {
			type: Array<mongoose.Types.ObjectId>,
			default: [],
			ref: "Answer",
		},
	},
	{
		methods: {
			async addAnswer(answerID: mongoose.Types.ObjectId) {
				await Question.updateOne(
					{ _id: this._id },
					{ $push: { answers: answerID } },
				);
			},
		},
	},
);

const Question = mongoose.model("Question", QuestionSchema);

export { Question };
