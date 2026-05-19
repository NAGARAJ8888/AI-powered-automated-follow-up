import LeadRow from './LeadRow';

const COLUMNS = [
  'Name', 'Email', 'Status', 'Automation Status', 'Current Step', 'Workflow', 'Actions',
];

/** Skeleton row shown while loading */
const SkeletonRow = () => (
  <tr className="animate-pulse">
    {COLUMNS.map((col, idx) => {
      // Deterministic width based on index to keep render pure.
      const width = 50 + (idx % 6) * 6; // 50..80
      return (
        <td key={col} className="px-6 py-4">
          <div
            className="h-4 bg-gray-100 rounded-full dark:bg-slate-800/70"
            style={{ width: `${width}%` }}
          />
        </td>
      );
    })}
  </tr>
);


/** Empty state shown when there are no leads */
const EmptyState = ({ onAddLead }) => (
  <tr>
    <td colSpan={COLUMNS.length}>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/30 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-1">No leads yet</h3>
        <p className="text-sm text-gray-500 dark:text-slate-300 max-w-xs mb-5">
          Start by adding your first lead to track follow-ups and automate outreach.
        </p>
        <button
          onClick={onAddLead}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Lead
        </button>
      </div>
    </td>
  </tr>
);

/** Error state */
const ErrorState = () => (
  <tr>
    <td colSpan={COLUMNS.length}>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 bg-red-50 dark:bg-red-950/30 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-red-500 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-1">Something went wrong</h3>
        <p className="text-sm text-gray-500 dark:text-slate-300">Failed to load leads. Please refresh the page.</p>
      </div>
    </td>
  </tr>
);

/**
 * LeadTable — renders a responsive table of leads.
 * Props:
 *   leads     (array)   – lead objects
 *   isLoading (bool)    – show skeleton rows
 *   isError   (bool)    – show error state
 *   onAddLead (fn)      – callback to open CreateLeadModal (used in empty state)
 */
const LeadTable = ({ leads = [], isLoading, isError, onAddLead, onViewTimeline }) => {
  const isEmpty = !isLoading && !isError && leads.length === 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-800" role="grid">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-slate-800/40">
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {isLoading && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
            {isError   && <ErrorState />}
            {isEmpty   && <EmptyState onAddLead={onAddLead} />}
            {!isLoading && !isError && leads.map((lead) => (
              <LeadRow key={lead._id} lead={lead} onViewTimeline={onViewTimeline} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer — count */}
      {!isLoading && !isError && leads.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/40 dark:border-slate-800 dark:bg-slate-800/30">
          <p className="text-xs text-gray-500 dark:text-slate-300">
            Showing <span className="font-medium text-gray-700 dark:text-slate-100">{leads.length}</span> lead{leads.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default LeadTable;
