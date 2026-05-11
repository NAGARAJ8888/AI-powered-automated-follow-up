/**
 * WorkflowsPage — /dashboard/workflows
 * Rendered inside DashboardLayout via <Outlet />.
 * Full workflow builder will be added in a future phase.
 */
const WorkflowsPage = () => {
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Workflows</h2>
        <p className="text-gray-500 mt-1">Build and manage your automated follow-up sequences.</p>
      </div>

      {/* Placeholder — workflow builder will be added in a future phase */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Workflow builder coming soon</h3>
        <p className="text-gray-500 max-w-sm text-sm">
          Create multi-step automation sequences with delays, conditions, and actions in the next phase.
        </p>
      </div>
    </div>
  );
};

export default WorkflowsPage;
