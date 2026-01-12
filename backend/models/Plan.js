import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: String,
    hours: String,
  },
  { timestamps: true }
);

export default mongoose.model("Plan", PlanSchema);
