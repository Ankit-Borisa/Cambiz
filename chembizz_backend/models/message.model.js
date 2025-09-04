const mongoose = require("mongoose");

function getISTTime() {
	const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
	const now = new Date();
	const istTime = new Date(now.getTime() + istOffset);
	return istTime;
}

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		// createdAt, updatedAt
	},
	{
		timestamps: {
			currentTime: () => getISTTime() // Use custom function for timestamps
		}
	}
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;