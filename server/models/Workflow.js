import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  stepNumber: Number,

  delay: {
    type: Number, // in hours
    required: true,
  },

  type: {
    type: String,
    enum: ["reminder", "escalation"],
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  escalateTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const workflowSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    steps: [stepSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Workflow", workflowSchema);