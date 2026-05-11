import { useRespondLeadMutation, usePauseLeadMutation, useResumeLeadMutation } from './leadApi';
import LeadStatusBadge from './LeadStatusBadge';

/**
 * LeadRow — a single <tr> in the leads table.
 * Renders all columns and action buttons for one lead.
 */
const LeadRow = ({ lead }) => {
  const [respondLead, { isLoading: isResponding }] = useRespondLeadMutation();
  const [pauseLead,   { isLoading: isPausing }]    = usePauseLeadMutation();
  const [resumeLead,  { isLoading: isResuming }]   = useResumeLeadMutation();

  const automationStatus = lead.automationStatus?.toLowerCase();
  const canPause  = automationStatus === 'active';
  const canResume = automationStatus === 'paused';

  const workflowName = lead.workflow?.name ?? lead.workflowName ?? '—';
  const currentStep  = lead.currentStep ?? lead.step ?? '—';

  const handleAction = async (action, id) => {
    try {
      await action(id).unwrap();
    } catch {
      // Errors are handled by RTK Query — could add a toast notification here
    }
  };

  return (
    <tr className="hover:bg-gray-50/70 transition-colors group">
      {/* Name */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold uppercase select-none">
            {lead.name?.[0] ?? '?'}
          </div>
          <span className="text-sm font-medium text-gray-900 truncate max-w-[160px]">
            {lead.name ?? '—'}
          </span>
        </div>
      </td>

      {/* Email */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-600 truncate max-w-[180px] block">
          {lead.email ?? '—'}
        </span>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <LeadStatusBadge value={lead.status} variant="status" />
      </td>

      {/* Automation Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <LeadStatusBadge value={lead.automationStatus} variant="automation" />
      </td>

      {/* Current Step */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-600">{currentStep}</span>
      </td>

      {/* Workflow */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-600 truncate max-w-[140px] block">{workflowName}</span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {/* Respond */}
          <ActionButton
            onClick={() => handleAction(respondLead, lead._id)}
            loading={isResponding}
            label="Respond"
            colorClass="text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-100"
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            }
          />

          {/* Pause — only when active */}
          {canPause && (
            <ActionButton
              onClick={() => handleAction(pauseLead, lead._id)}
              loading={isPausing}
              label="Pause"
              colorClass="text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-100"
              icon={
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              }
            />
          )}

          {/* Resume — only when paused */}
          {canResume && (
            <ActionButton
              onClick={() => handleAction(resumeLead, lead._id)}
              loading={isResuming}
              label="Resume"
              colorClass="text-green-600 bg-green-50 hover:bg-green-100 border-green-100"
              icon={
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              }
            />
          )}
        </div>
      </td>
    </tr>
  );
};

/** Reusable small action button used inside LeadRow */
const ActionButton = ({ onClick, loading, label, colorClass, icon }) => (
  <button
    onClick={onClick}
    disabled={loading}
    title={label}
    aria-label={label}
    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${colorClass}`}
  >
    {loading ? (
      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    ) : (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon}
      </svg>
    )}
    {label}
  </button>
);

export default LeadRow;
