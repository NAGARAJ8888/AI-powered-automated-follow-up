import { followUpQueue } from "../config/queue.js";
import Lead from "../models/Lead.js";
import { sendEmail } from "../services/emailService.js";

function buildEmailContent({ stepType, message }) {
  const subject = stepType === "escalation" ? "Escalation" : "Reminder";
  const text = message;
  const safe = String(message ?? "").replaceAll("&", "&amp;").replaceAll("<", "<").replaceAll(">", ">");
  const html = `<p>${safe}</p>`;
  return { subject, text, html };
}

followUpQueue.process(async (job) => {
  try {
    console.log("🚀 Worker started...");
    const { leadId, stepIndex } = job.data;

    const lead = await Lead.findById(leadId).populate("workflow");
    if (!lead) return;

    if (lead.automationStatus !== "active") {
      console.log("Automation stopped for lead:", leadId);
      return;
    }

    const workflow = lead.workflow;
    const step = workflow?.steps?.[stepIndex];
    if (!step) return;

    // Only attempt email sending for reminder/escalation steps
    if (step.type === "reminder" || step.type === "escalation") {
      try {
        if (!lead.email) {
          throw new Error("Lead has no email address");
        }

        const { subject, text, html } = buildEmailContent({
          stepType: step.type,
          message: step.message,
        });

        console.log("WORKER: ABOUT TO CALL sendEmail()");
        console.log("WORKER STEP:", step.type);
        console.log("WORKER RECIPIENT:", lead.email);

        const result = await sendEmail({
          to: lead.email,
          subject,
          text,
          html,
        });

        console.log("WORKER: EMAIL SENT SUCCESSFULLY");
        console.log(result);

        lead.history.push({
          step: stepIndex,
          type: "email_sent",
          message: step.message,
          recipient: lead.email,
          messageSummary: String(step.message ?? "").slice(0, 120),
          deliveryStatus: "sent",
          timestamp: new Date(),
        });
      } catch (emailError) {
        const errMsg = emailError?.message || String(emailError);
        console.error("Email send failed:", errMsg);
        console.error("WORKER EMAIL ERROR:", errMsg);

        lead.history.push({
          step: stepIndex,
          type: "email_failed",
          message: step.message,
          recipient: lead.email,
          messageSummary: String(step.message ?? "").slice(0, 120),
          deliveryStatus: "failed",
          errorMessage: emailError?.message || String(emailError),
          timestamp: new Date(),
        });

      }
    }

    // Preserve existing activity history for workflow steps
    lead.history.push({
      step: stepIndex,
      type: step.type,
      message: step.message,
      timestamp: new Date(),
    });

    lead.currentStep = stepIndex + 1;
    lead.lastContactedAt = new Date();

    await lead.save();

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
