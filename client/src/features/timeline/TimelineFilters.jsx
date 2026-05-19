import React from 'react';

const FILTERS = [
  { value: 'all', label: 'All events' },
  { value: 'reminders', label: 'Reminders' },
  { value: 'escalations', label: 'Escalations' },
  { value: 'responses', label: 'Responses' },
  { value: 'automation', label: 'Automation' },
];

export default function TimelineFilters({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => {
        const active = value === f.value;
        return (
          <button
            key={f.value}
            type="button"
            onClick={() => onChange?.(f.value)}
            className={`inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-semibold border transition-colors whitespace-nowrap ${
              active
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200 border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/60'
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

