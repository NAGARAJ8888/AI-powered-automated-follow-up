import express from "express";
import {
  createWorkflow,
  getWorkflows,
  getWorkflowById,
  deleteWorkflow,
} from "../controllers/workflowController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createWorkflow);
router.get("/", protect, getWorkflows);
router.get("/:id", protect, getWorkflowById);
router.delete("/:id", protect, deleteWorkflow);

export default router;