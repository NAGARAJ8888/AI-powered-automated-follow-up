// ✅ Must be the very first import in ESM.
// 'dotenv/config' runs its side-effect (dotenv.config()) during the import
// evaluation phase — before any other module body executes.
import "dotenv/config";

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import workflowRoutes from "./routes/workflowRoutes.js";
import "./workers/followUpWorker.js"; // registers queue.process() — must import here

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/workflows", workflowRoutes);

// Server start
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });