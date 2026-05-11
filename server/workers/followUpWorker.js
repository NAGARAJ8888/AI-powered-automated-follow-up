import { followUpQueue } from "../config/queue.js";
import Lead from "../models/Lead.js";
import Workflow from "../models/Workflow.js";

followUpQueue.process(async (job) => {
  try {
    console.log("🚀 Worker started...");
    const { leadId, stepIndex } = job.data;

    const lead = await Lead.findById(leadId).populate("workflow");

    if (!lead) return;

    // 🚦 STOP if responded or paused
    if (lead.automationStatus !== "active") {
      console.log("Automation stopped for lead:", leadId);
      return;
    }

    const workflow = lead.workflow;
    const step = workflow.steps[stepIndex];

    if (!step) return;

    if (step.type === "reminder") {
      console.log(`📩 Reminder sent to ${lead.email}`);
    }

    if (step.type === "escalation") {
      console.log(`🚨 Escalation triggered for ${lead.email}`);
    }

    lead.history.push({
      step: stepIndex,
      type: step.type,
      message: step.message,
      timestamp: new Date(),
    });

    lead.currentStep = stepIndex + 1;
    lead.lastContactedAt = new Date();

    await lead.save();

    // ⏭️ Schedule next step
    const nextStep = workflow.steps[stepIndex + 1];

    if (nextStep) {
      await followUpQueue.add(
        {
          leadId,
          stepIndex: stepIndex + 1,
        },
        {
          delay: nextStep.delay * 60 * 60 * 1000,
        }
      );
    } else {
      lead.automationStatus = "completed";
      await lead.save();
    }
  } catch (error) {
    console.error("Worker error:", error);
  }
});