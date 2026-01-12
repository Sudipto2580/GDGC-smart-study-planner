import express from "express";
import Exam from "../models/Exam.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all exams
router.get("/", auth, async (req, res) => {
  const exams = await Exam.find({ userId: req.userId });
  res.json(exams);
});

// Add exam
router.post("/", auth, async (req, res) => {
  const { name, date } = req.body;

  const exam = await Exam.create({
    userId: req.userId,
    name,
    date,
  });

  res.json(exam);
});

// Delete exam
router.delete("/:id", auth, async (req, res) => {
  await Exam.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });

  res.json({ success: true });
});

export default router;
