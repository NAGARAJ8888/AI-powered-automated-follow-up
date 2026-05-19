export function safeParseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function sortEventsNewestFirst(events) {
  return [...events].sort((a, b) => {
    const ta = safeParseDate(a.timestamp)?.getTime() ?? 0;
    const tb = safeParseDate(b.timestamp)?.getTime() ?? 0;
    return tb - ta;
  });
}

export function getEventIcon(eventType) {
  const t = (eventType || '').toLowerCase();
  if (t === 'reminder') return '⏰';
  if (t === 'escalation') return '🚨';
  if (t === 'response') return '💬';
  if (t === 'pause') return '⏸️';
  if (t === 'resume') return '▶️';
  if (t === 'completed' || t === 'complete' || t === 'automation_completed') return '✅';
  if (t === 'workflow_assigned') return '🧩';
  return '🗂️';
}

export function getEventBadgeVariant(event) {
  // Centralized mapping so UI stays consistent.
  // We keep it resilient because backend currently pushes some pause/resume messages
  // under history.type="response".
  const type = (event?.type || '').toLowerCase();
  const msg = String(event?.message ?? '').toLowerCase();
  const automationStatus = String(event?.automationStatus ?? '').toLowerCase();

  if (type === 'reminder') return 'reminder';
  if (type === 'escalation') return 'escalation';

  // Pause / resume / completed may be encoded in message text
  if (msg.includes('paused') || type === 'pause' || automationStatus === 'paused') return 'pause';
  if (msg.includes('resumed') || type === 'resume' || automationStatus === 'active') return 'resume';

  if (
    msg.includes('completed') ||
    msg.includes('automation completed') ||
    type === 'completed' ||
    automationStatus === 'completed'
  ) {
    return 'completed';
  }

  // Response: either explicit response type, or lead status transitioned to contacted/qualified.
  if (type === 'response') return 'response';
  if (msg.includes('respond') || automationStatus === 'responded') return 'response';

  // Workflow assignment if we can infer from message
  if (msg.includes('assigned') || msg.includes('workflow')) return 'workflow_assigned';

  return 'response';
}

export function normalizeHistoryEvents({ lead, includeWorkflowAssigned = true }) {
  const history = Array.isArray(lead?.history) ? lead.history : [];

  const baseAutomationStatus = lead?.automationStatus;
  const leadCreatedAt = lead?.createdAt;

  const events = history.map((h, idx) => {
    const ts = h?.timestamp ?? leadCreatedAt ?? lead?._id;
    return {
      id: `h-${lead?._id ?? 'lead'}-${ts ?? idx}-${idx}`,
      step: h?.step,
      type: h?.type,
      message: h?.message,
      timestamp: ts,
      automationStatus: baseAutomationStatus,
      workflow: lead?.workflow,
    };
  });

  if (includeWorkflowAssigned) {
    // We may not have an explicit history entry for workflow assignment.
    // Create a synthetic event based on lead.workflow existence and createdAt.
    if (lead?.workflow && leadCreatedAt) {
      events.push({
        id: `wf-assigned-${lead?._id}`,
        step: lead?.currentStep ?? 0,
        type: 'workflow_assigned',
        message: `Workflow assigned: ${lead.workflow?.name ?? lead.workflow?.workflowName ?? '—'}`,
        timestamp: leadCreatedAt,
        automationStatus: baseAutomationStatus,
        workflow: lead.workflow,
      });
    }
  }

  return sortEventsNewestFirst(events);
}

export function filterEvents(events, filter) {
  if (filter === 'all') return events;

  const f = filter.toLowerCase();
  return events.filter((e) => {
    const v = getEventBadgeVariant(e);
    if (f === 'reminders') return v === 'reminder';
    if (f === 'escalations') return v === 'escalation';
    if (f === 'responses') return v === 'response';

    // automation includes pause/resume/completed/workflow-assigned
    if (f === 'automation') {
      return ['pause', 'resume', 'completed', 'workflow_assigned'].includes(v);
    }

    return v === f;
  });
}

export function formatAbsoluteTime(value) {
  const d = safeParseDate(value);
  if (!d) return '—';

  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(value) {
  const d = safeParseDate(value);
  if (!d) return '';

  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);

  if (diffSec < 60) return `${diffSec} sec ago`;
  if (diffMin < 60) return `${diffMin} min ago`;
  return `${diffHr} hr ago`;
}

