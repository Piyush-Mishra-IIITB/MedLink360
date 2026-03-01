import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "appointment",
    required: true
  },

  sender: {
    type: String,
    enum: ["doctor", "patient"],
    required: true
  },

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  text: {
    type: String,
    required: true
  },

  seen: {
    type: Boolean,
    default: false
  },
  

}, { timestamps: true });

export default mongoose.model("message", messageSchema);