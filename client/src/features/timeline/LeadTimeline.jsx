import { useMemo, useState } from 'react';

import TimelineItem from './TimelineItem';
import TimelineFilters from './TimelineFilters';
import { filterEvents, normalizeHistoryEvents } from './timelineUtils';

function SkeletonLine() {
  return (
    <div className="relative pl-8 sm:pl-10">
      <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-slate-800" />
      <div className="absolute left-2.5 sm:left-3 top-4 w-5 h-5 rounded-full bg-white dark:bg-slate-900 ring-2 ring-blue-200 dark:ring-blue-900" />
      <div className="space-y-2 pb-4">
        <div className="h-6 w-28 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-4 w-72 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-3 w-52 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
      </div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="py-10 text-center">
      <div className="mx-auto w-14 h-14 bg-red-50 dark:bg-red-950/30 rounded-2xl flex items-center justify-center mb-3">
        <svg className="w-7 h-7 text-red-500 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{message ?? 'Failed to load timeline'}</p>
      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Try again or refresh the page.</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-10 text-center">
      <div className="mx-auto w-14 h-14 bg-blue-50 dark:bg-blue-950/30 rounded-2xl flex items-center justify-center mb-3">
        <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">No activity yet</p>
      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">When automation runs, timeline events will appear here.</p>
    </div>
  );
}

export default function LeadTimeline({ lead, isLoading = false, isError = false }) {
  const [filter, setFilter] = useState('all');

  const events = useMemo(() => {
    if (!lead) return [];
    const normalized = normalizeHistoryEvents({ lead, includeWorkflowAssigned: true });
    return normalized;
  }, [lead]);

  const filtered = useMemo(() => {
    return filterEvents(events, filter);
  }, [events, filter]);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-slate-100">
              Activity Timeline
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              {lead?.name ? `Lead: ${lead.name}` : 'Execution and follow-up history'}
            </p>
          </div>

          <div className="sm:min-w-[320px]">
            <TimelineFilters value={filter} onChange={setFilter} />
          </div>
        </div>
      </div>

      {isError ? (
        <div className="px-4 sm:px-6">
          <ErrorState />
        </div>
      ) : null}

      {isLoading ? (
        <div className="px-4 sm:px-6 py-3">
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine />
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <div className="px-4 sm:px-6 py-3">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="relative">
              {filtered.map((event, idx) => (
                <div key={event.id}>
                  <TimelineItem event={event} />
                  {idx === filtered.length - 1 ? (
                    <div className="h-2" />
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

