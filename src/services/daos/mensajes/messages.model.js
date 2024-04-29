import mongoose from "mongoose";
const MESSAGES_COLLECTION = "messages";

const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  message: { type: String },
  created: { type: Date, default: Date.now },
});
const messageModel = mongoose.model(MESSAGES_COLLECTION, messageSchema);

export default messageModel;
