import express from "express";
import {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  respondToLead,
  pauseAutomation,
  resumeAutomation,
} from "../controllers/leadController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createLead);
router.get("/", protect, getLeads);
router.put("/:id", protect, updateLead);
router.delete("/:id", protect, deleteLead);
router.put("/:id/respond", protect, respondToLead);
router.put("/:id/pause", protect, pauseAutomation);
router.put("/:id/resume", protect, resumeAutomation);

export default router;