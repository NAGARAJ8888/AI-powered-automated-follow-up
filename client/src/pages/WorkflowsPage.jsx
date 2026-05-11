import { useMemo, useState } from 'react';
import { useGetWorkflowsQuery } from '../features/workflows/workflowApi';
import CreateWorkflowModal from '../features/workflows/CreateWorkflowModal';
import WorkflowCard from '../features/workflows/WorkflowCard';

const WorkflowsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const { data: workflowsData, isLoading, isError, error, isFetching } = useGetWorkflowsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const workflows = useMemo(() => {
    const raw = workflowsData?.workflows ?? workflowsData;
    return Array.isArray(raw) ? raw : [];
  }, [workflowsData]);

  const apiErrorMessage = useMemo(() => {
    return error?.data?.message ?? 'Failed to load workflows.';
  }, [error]);

  const isEmpty = !isLoading && !isError && workflows.length === 0;

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workflows</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Build and manage automated follow-up sequences with reminders and escalations.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Workflow
        </button>
      </div>

      {/* Refresh indicator strip */}
      {isFetching && !isLoading && (
        <div className="h-0.5 rounded-full bg-blue-100 overflow-hidden">
          <div className="h-full bg-blue-500 animate-pulse" style={{ width: '60%' }} />
        </div>
      )}

      {/* Main content */}
      {isError && (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Unable to load workflows</h3>
              <p className="text-sm text-gray-600 mt-1">{apiErrorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2 mt-2" />
              <div className="h-24 bg-gray-50 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      )}

      {isEmpty && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No workflows yet</h3>
          <p className="text-gray-500 max-w-sm text-sm">
            Create your first multi-step automation with reminders and escalation.
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Workflow
          </button>
        </div>
      )}

      {!isLoading && !isError && workflows.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map((wf) => (
            <WorkflowCard key={wf._id} workflow={wf} />
          ))}
        </div>
      )}

      {/* Create workflow modal */}
      <CreateWorkflowModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default WorkflowsPage;

