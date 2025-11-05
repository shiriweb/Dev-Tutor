const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    topic: {
      type: String,
      enum: ["JavaScript", "React", "Python", "HTML/CSS"],
      required: true,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

// index for faster queries
chatSchema.index({ userId: 1, topic: 1 });

const Chat = mongoose.model("Chat", chatSchema);
module.exports = { Chat };
