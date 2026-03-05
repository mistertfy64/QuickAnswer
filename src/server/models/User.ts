import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { sha256 } from "../utilities/sha256";

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			required: true,
		},
		tokens: {
			type: Array<String>,
		},
	},
	{
		methods: {
			async checkPassword(enteredPassword: string) {
				return await bcrypt.compare(enteredPassword, this.password);
			},
			async addToken(token: string) {
				const hashedToken = sha256(token);
				await User.updateOne(
					{ _id: this._id },
					{ $push: { tokens: hashedToken } },
				);
			},
		},
	},
);

UserSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt(12);
	this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", UserSchema);

export { User };
