/**
 * LeadStatusBadge — renders a colour-coded pill for lead status or automation status.
 * variant: "status" | "automation"
 */

const statusMap = {
  new:       { label: 'New',       className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
  contacted: { label: 'Contacted', className: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200' },
  qualified: { label: 'Qualified', className: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200' },
  converted: { label: 'Converted', className: 'bg-green-50 text-green-700 ring-1 ring-green-200' },
  lost:      { label: 'Lost',      className: 'bg-red-50 text-red-700 ring-1 ring-red-200' },
};

const automationMap = {
  active:    { label: 'Active',    className: 'bg-green-50 text-green-700 ring-1 ring-green-200' },
  paused:    { label: 'Paused',    className: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200' },
  completed: { label: 'Completed', className: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200' },
  pending:   { label: 'Pending',   className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
};

const LeadStatusBadge = ({ value, variant = 'status' }) => {
  const map = variant === 'automation' ? automationMap : statusMap;
  const config = map[value?.toLowerCase()] ?? {
    label: value ?? '—',
    className: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default LeadStatusBadge;
