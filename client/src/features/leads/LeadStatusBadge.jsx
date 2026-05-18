/**
 * LeadStatusBadge — renders a colour-coded pill for lead status or automation status.
 * variant: "status" | "automation"
 */

const statusMap = {
  new: {
    label: 'New',
    className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-200 dark:ring-blue-900/60',
  },
  contacted: {
    label: 'Contacted',
    className: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-200 dark:ring-yellow-900/60',
  },
  qualified: {
    label: 'Qualified',
    className: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200 dark:bg-purple-950/30 dark:text-purple-200 dark:ring-purple-900/60',
  },
  converted: {
    label: 'Converted',
    className: 'bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-950/30 dark:text-green-200 dark:ring-green-900/60',
  },
  lost: {
    label: 'Lost',
    className: 'bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950/30 dark:text-red-200 dark:ring-red-900/60',
  },
};

const automationMap = {
  active: {
    label: 'Active',
    className: 'bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-950/30 dark:text-green-200 dark:ring-green-900/60',
  },
  paused: {
    label: 'Paused',
    className: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-950/30 dark:text-orange-200 dark:ring-orange-900/60',
  },
  completed: {
    label: 'Completed',
    className:
      'bg-gray-100 text-gray-600 ring-1 ring-gray-200 dark:bg-gray-800/70 dark:text-gray-300 dark:ring-gray-700',
  },
  pending: {
    label: 'Pending',
    className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-200 dark:ring-blue-900/60',
  },
};

const LeadStatusBadge = ({ value, variant = 'status' }) => {
  const map = variant === 'automation' ? automationMap : statusMap;
  const config =
    map[value?.toLowerCase()] ?? {
      label: value ?? '—',
      className:
        'bg-gray-100 text-gray-600 ring-1 ring-gray-200 dark:bg-gray-800/70 dark:text-gray-300 dark:ring-gray-700',
    };

  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>{config.label}</span>;
};

export default LeadStatusBadge;

