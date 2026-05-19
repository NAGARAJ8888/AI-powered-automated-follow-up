import React from 'react';
import { getEventBadgeVariant, getEventIcon } from './timelineUtils';

const variantStyles = {
  reminder: {
    base: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-200 dark:border-blue-900/50',
  },
  escalation: {
    base: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-200 dark:border-rose-900/50',
  },
  response: {
    base: 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/30 dark:text-violet-200 dark:border-violet-900/50',
  },
  pause: {
    base: 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/30 dark:text-orange-200 dark:border-orange-900/50',
  },
  resume: {
    base: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-200 dark:border-emerald-900/50',
  },
  completed: {
    base: 'bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-200 dark:border-emerald-900/50',
  },
  workflow_assigned: {
    base: 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-900/30 dark:text-slate-200 dark:border-slate-700/50',
  },
};

export default function ActivityBadge({ event, className = '' }) {
  const v = getEventBadgeVariant(event);
  const styles = variantStyles[v] || variantStyles.response;

  const icon = getEventIcon(event?.type || v);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles.base} ${className}`}
      title={String(event?.type ?? v)}
    >
      <span className="text-[13px] leading-none">{icon}</span>
      <span className="capitalize">{v.replace('workflow_assigned', 'workflow')}</span>
    </span>
  );
}

