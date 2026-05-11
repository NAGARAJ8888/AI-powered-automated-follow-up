import Lead from "../models/Lead.js";
import { followUpQueue } from "../config/queue.js";
import Workflow from "../models/Workflow.js";

// CREATE LEAD
export const createLead = async (req, res) => {
  try {
    const { name, email, phone, workflowId } = req.body;
    console.log(req.body);

    const lead = await Lead.create({
      name,
      email,
      phone,

      createdBy: req.user._id,

      // 🔥 THIS IS THE IMPORTANT PART
      workflow: workflowId,

      // initialize automation
      currentStep: 0,
      automationStatus: "active",
    });

    // Start automation
if (lead.workflow) {
  const workflow = await Workflow.findById(lead.workflow);

  const firstStep = workflow.steps[0];

  if (firstStep) {
    await followUpQueue.add(
      {
        leadId: lead._id,
        stepIndex: 0,
      },
      {
        // delay: firstStep.delay * 60 * 60 * 1000, // ← re-enable for production (hours → ms)
        delay: 0, // 0 for testing; worker fires immediately
      }
    );
  }
}

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL LEADS
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("assignedTo", "name email")
      .populate("createdBy", "name");

    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE LEAD
export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    Object.assign(lead, req.body);
    await lead.save();

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE LEAD
export const deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const respondToLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    // 🚦 Stop automation
    lead.status = "contacted";
    lead.automationStatus = "responded";

    // 📜 Add history
    lead.history.push({
      type: "response",
      message: "Lead responded",
    });

    await lead.save();

    res.json({
      message: "Lead marked as responded",
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const pauseAutomation = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    lead.automationStatus = "paused";

    lead.history.push({
      type: "response",
      message: "Automation paused",
    });

    await lead.save();

    res.json({
      message: "Automation paused",
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resumeAutomation = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("workflow");

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    lead.automationStatus = "active";

    await lead.save();

    const nextStep = lead.currentStep + 1;

    const workflowStep = lead.workflow.steps[nextStep];

    if (workflowStep) {
      await followUpQueue.add(
        {
          leadId: lead._id,
          stepIndex: nextStep,
        },
        {
          delay: workflowStep.delay * 60 * 60 * 1000,
        }
      );
    }

    res.json({
      message: "Automation resumed",
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

