import React from 'react';
import LeadTimeline from '../timeline/LeadTimeline';

export default function TimelineModal({ isOpen, onClose, lead, isLoading, isError }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-gray-900/50 dark:bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative min-h-full flex items-center justify-center p-4">
        <div
          className="w-full max-w-3xl"
          role="dialog"
          aria-modal="true"
          aria-label="Lead activity timeline"
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-slate-800 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-slate-100">
                  Execution History
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  {lead?.name ? `Activity for ${lead.name}` : 'Lead timeline'}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-xl p-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close"
                title="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-3 sm:p-5">
              <LeadTimeline lead={lead} isLoading={isLoading} isError={isError} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

