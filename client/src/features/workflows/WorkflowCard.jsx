import { useDeleteWorkflowMutation } from './workflowApi';

const formatDate = (value) => {
  const d = value ? new Date(value) : null;
  if (!d || Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
};

const stepPreviewText = (workflow) => {
  const steps = workflow?.steps ?? [];
  const normalized = Array.isArray(steps) ? steps : [];
  if (normalized.length === 0) return 'No steps configured.';

  const first = normalized[0];
  const type = first?.type === 'escalation' ? 'Escalation' : 'Reminder';
  const delay = first?.delay ?? '';

  if (normalized.length === 1) {
    return `${type}: delay ${delay}`;
  }

  return `${type}: delay ${delay} • +${normalized.length - 1} more`;
};

const WorkflowCard = ({ workflow, onDeleted }) => {
  const [deleteWorkflow, { isLoading }] = useDeleteWorkflowMutation();

  const handleDelete = async () => {
    const ok = window.confirm(`Delete workflow "${workflow?.name ?? 'this workflow'}"?`);
    if (!ok) return;

    try {
      await deleteWorkflow(workflow._id).unwrap();
      onDeleted?.();
    } catch {
      // error will be handled by RTKQ cache invalidation/console; keep UI simple
      // (Phase 4.5 asks for error states; page-level handling can be added later)
    }
  };

  const steps = workflow?.steps ?? [];
  const normalizedSteps = Array.isArray(steps) ? steps : [];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100 line-clamp-2">
            {workflow?.name ?? 'Untitled workflow'}
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-slate-300">
            Created {formatDate(workflow?.createdAt ?? workflow?._id)}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold border border-red-200 text-red-600 bg-white hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors dark:bg-white/0 dark:hover:bg-red-950/20 dark:border-red-900/50 dark:text-red-400"
          aria-label={`Delete ${workflow?.name ?? 'workflow'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a2 2 0 00-2-2h-4a2 2 0 00-2 2m8 0H7"
            />
          </svg>
          Delete
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-slate-300">Total steps</span>
          <span className="text-xs font-semibold text-gray-900 dark:text-slate-100">
            {normalizedSteps.length}
          </span>
        </div>

        <div className="rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-gray-700 p-3">
          <p className="text-xs font-semibold text-gray-700 dark:text-slate-200">Step preview</p>
          <p className="text-xs text-gray-600 dark:text-slate-300 mt-1">{stepPreviewText(workflow)}</p>
        </div>

        {normalizedSteps.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {normalizedSteps.slice(0, 4).map((s, i) => (
              <span
                key={s.stepNumber ?? i}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  s.type === 'escalation'
                    ? 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-200'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-200'
                }`}
              >
                {s.type === 'escalation' ? 'Escalation' : 'Reminder'}
                <span className="text-gray-500 dark:text-slate-300 font-bold">·</span>
                <span className="text-gray-700 dark:text-slate-100">{s.delay}</span>
              </span>
            ))}
            {normalizedSteps.length > 4 && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-slate-300">
                +{normalizedSteps.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowCard;

