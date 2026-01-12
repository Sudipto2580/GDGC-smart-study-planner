import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import examRoutes from "./routes/exams.js";
import authRoutes from "./routes/auth.js";
import planRoutes from "./routes/plans.js";
import sessionRoutes from "./routes/sessions.js";

// ✅ Load env variables FIRST
dotenv.config();

// ✅ Create app
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/sessions", sessionRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("SmartStudyPlanner API running");
});

// ✅ Debug env
console.log("MONGO_URI =", process.env.MONGO_URI);

// ✅ Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
