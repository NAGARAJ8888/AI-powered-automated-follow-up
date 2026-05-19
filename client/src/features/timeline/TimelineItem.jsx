import ActivityBadge from './ActivityBadge';

import { formatAbsoluteTime, formatRelativeTime } from './timelineUtils';

export default function TimelineItem({ event }) {
  const badge = <ActivityBadge event={event} />;

  return (
    <div className="relative pl-8 sm:pl-10">
      {/* Vertical line */}
      <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-slate-800" />

      {/* Dot */}
      <div className="absolute left-2.5 sm:left-3 top-4 w-5 h-5 rounded-full bg-white dark:bg-slate-900 ring-2 ring-blue-200 dark:ring-blue-900" />

      <div className="space-y-1 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {badge}
          {typeof event?.step === 'number' && Number.isFinite(event.step) ? (
            <span className="text-xs font-semibold text-gray-600 dark:text-slate-300">
              Step {event.step}
            </span>
          ) : null}
          {event?.workflow?.name ? (
            <span className="text-xs text-gray-500 dark:text-slate-400 truncate max-w-[180px]">
              {event.workflow.name}
            </span>
          ) : null}
        </div>

        <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
          {event?.message ?? '—'}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-slate-400">
          <span className="font-semibold text-gray-600 dark:text-slate-300">{formatAbsoluteTime(event?.timestamp)}</span>
          <span>{formatRelativeTime(event?.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

