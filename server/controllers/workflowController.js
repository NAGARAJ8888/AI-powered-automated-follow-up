import Workflow from "../models/Workflow.js";

// ✅ Create Workflow
export const createWorkflow = async (req, res) => {
  try {
    const { name, steps } = req.body;

    const workflow = await Workflow.create({
      name,
      steps,
      createdBy: req.user._id,
    });

    res.status(201).json(workflow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Workflows
export const getWorkflows = async (req, res) => {
  try {
    const workflows = await Workflow.find().populate("createdBy", "name email");
    res.json(workflows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Single Workflow
export const getWorkflowById = async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    res.json(workflow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Workflow
export const deleteWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    await workflow.deleteOne();
    res.json({ message: "Workflow deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};