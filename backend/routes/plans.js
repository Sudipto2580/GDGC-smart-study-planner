import express from "express";
import Plan from "../models/Plan.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all plans
router.get("/", auth, async (req, res) => {
  const plans = await Plan.find({ userId: req.userId });
  res.json(plans);
});

// Add plan
router.post("/", auth, async (req, res) => {
  const { subject, hours } = req.body;

  const plan = await Plan.create({
    userId: req.userId,
    subject,
    hours,
  });

  res.json(plan);
});

// Update plan
router.put("/:id", auth, async (req, res) => {
  const updated = await Plan.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );

  res.json(updated);
});

// Delete plan
router.delete("/:id", auth, async (req, res) => {
  await Plan.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });

  res.json({ success: true });
});

export default router;
