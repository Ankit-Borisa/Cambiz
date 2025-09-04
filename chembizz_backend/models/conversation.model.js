const mongoose = require("mongoose");

function getISTTime() {
	const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
	const now = new Date();
	const istTime = new Date(now.getTime() + istOffset);
	return istTime;
}

const conversationSchema = new mongoose.Schema(
	{
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "chat",
				default: [],
			},
		],
	},
	{
		timestamps: {
			currentTime: () => getISTTime() // Use custom function for timestamps
		}
	}
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;