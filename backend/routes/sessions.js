import express from "express";
import Session from "../models/Session.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all sessions (for future analytics)
router.get("/", auth, async (req, res) => {
  const sessions = await Session.find({ userId: req.userId });
  res.json(sessions);
});

// Save completed session
router.post("/", auth, async (req, res) => {
  const { type, duration } = req.body;

  const session = await Session.create({
    userId: req.userId,
    type,
    duration,
  });

  res.json(session);
});

export default router;
