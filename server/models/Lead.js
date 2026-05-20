import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },

    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "closed"],
      default: "new",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 🔥 NEW: Workflow reference
    workflow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workflow",
    },

    // 🔁 Track automation progress
    currentStep: {
      type: Number,
      default: 0,
    },

    // 🚦 Control automation
    automationStatus: {
      type: String,
      enum: ["active", "paused", "responded", "completed"],
      default: "active",
    },

    // 🕒 Last action timestamp
    lastContactedAt: Date,

    // 📅 Next scheduled action (optional UI use)
    nextFollowUpDate: Date,

    // 📜 Activity history
    history: [
      {
        step: Number,
        type: {
          type: String,
          enum: ["reminder", "escalation", "response", "email_sent", "email_failed"],
        },
        // Used by email delivery history
        recipient: String,
        messageSummary: String,
        deliveryStatus: String,

        message: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);