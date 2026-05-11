// Phase 4.6 Analytics Dashboard
// This file intentionally stays minimal.
// Current analytics derives metrics on the frontend from existing RTK Query endpoints.

export function deriveLeadMetrics(leads) {
  const list = Array.isArray(leads) ? leads : [];

  const normalize = (v) => (typeof v === "string" ? v.toLowerCase() : v);

  const total = list.length;
  const active = list.filter((l) => normalize(l?.automationStatus) === "active").length;
  const paused = list.filter((l) => normalize(l?.automationStatus) === "paused").length;
  const responded = list.filter((l) => normalize(l?.status) === "contacted" || normalize(l?.status) === "qualified" || normalize(l?.status) === "converted").length;

  return {
    total,
    active,
    paused,
    responded,
  };
}

export function deriveWorkflowMetrics(workflows) {
  const list = Array.isArray(workflows) ? workflows : [];

  const total = list.length;
  // No explicit workflow 'active' in current UI; treat workflows as active by default
  // unless backend indicates a status field.
  const normalize = (v) => (typeof v === "string" ? v.toLowerCase() : v);
  const active = list.filter((w) => normalize(w?.status) === "active").length || total;

  const stepCounts = list.map((w) => (Array.isArray(w?.steps) ? w.steps.length : 0));
  const avgSteps = stepCounts.length
    ? stepCounts.reduce((a, b) => a + b, 0) / stepCounts.length
    : 0;

  return {
    total,
    active,
    avgSteps,
  };
}

export function deriveAutomationMetrics(leads) {
  const list = Array.isArray(leads) ? leads : [];
  const normalize = (v) => (typeof v === "string" ? v.toLowerCase() : v);

  const running = list.filter((l) => normalize(l?.automationStatus) === "active").length;
  const completed = list.filter((l) => normalize(l?.automationStatus) === "completed").length;

  // Escalated: infer from workflow step type of the lead's current step.
  // If backend marks escalation elsewhere, this can be adjusted later.
  const escalated = list.filter((l) => {
    const step = l?.currentStep ?? l?.step;
    const stepType = typeof step === "string" ? step.toLowerCase() : step?.type;
    return stepType === "escalation" || normalize(l?.automationStatus) === "escalated";
  }).length;

  return {
    running,
    completed,
    escalated,
  };
}

