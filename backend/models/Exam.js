import mongoose from "mongoose";

const ExamSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    date: String, // YYYY-MM-DD
  },
  { timestamps: true }
);

export default mongoose.model("Exam", ExamSchema);
