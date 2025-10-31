import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    
});

export const Chat = new mongoose.model("Chat", chatSchema);
