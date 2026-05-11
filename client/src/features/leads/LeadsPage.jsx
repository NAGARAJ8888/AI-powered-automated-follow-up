import { useState } from 'react';
import { useGetLeadsQuery } from './leadApi';
import LeadTable from './LeadTable';
import CreateLeadModal from './CreateLeadModal';

/**
 * LeadsPage — /dashboard/leads
 * Orchestrates the lead table and create-lead modal.
 * Rendered inside DashboardLayout via <Outlet />.
 */
const LeadsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const { data: leadsData, isLoading, isError, isFetching } = useGetLeadsQuery(undefined, {
    // Always re-fetch from backend when this component mounts (e.g. route re-entry)
    // instead of serving the 30 s stale cache
    refetchOnMountOrArgChange: true,
    // Poll every 30 s so server-driven automation status changes (active → paused
    // → completed) are picked up without a manual refresh
    pollingInterval: 30_000,
  });

  // Backend may return { leads: [...] } or a raw array — handle both
  const leads = leadsData?.leads ?? leadsData ?? [];

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leads</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Manage and track all your leads in one place.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Lead
        </button>
      </div>

      {/* Refresh indicator strip */}
      {isFetching && !isLoading && (
        <div className="h-0.5 rounded-full bg-blue-100 overflow-hidden">
          <div className="h-full bg-blue-500 animate-pulse" style={{ width: '60%' }} />
        </div>
      )}

      {/* Leads table */}
      <LeadTable
        leads={leads}
        isLoading={isLoading}
        isError={isError}
        onAddLead={() => setModalOpen(true)}
      />

      {/* Create lead modal */}
      <CreateLeadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default LeadsPage;
