import { useMemo } from "react";
import { useGetLeadsQuery } from "../leads/leadApi";
import { useGetWorkflowsQuery } from "../workflows/workflowApi";
import StatsCard from "./StatsCard";
import LeadsOverviewChart from "./LeadsOverviewChart";
import AutomationChart from "./AutomationChart";
import WorkflowChart from "./WorkflowChart";
import RecentActivity from "./RecentActivity";
import {
  deriveAutomationMetrics,
  deriveLeadMetrics,
  deriveWorkflowMetrics,
} from "./dashboardApi";



function formatNumber(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "—";
  return num.toLocaleString();
}

const DashboardPage = () => {
  const {
    data: leadsData,
    isLoading: isLeadsLoading,
    isError: isLeadsError,
    isFetching: isLeadsFetching,
  } = useGetLeadsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 30_000,
  });

  const {
    data: workflowsData,
    isLoading: isWfLoading,
    isError: isWfError,
    isFetching: isWfFetching,
  } = useGetWorkflowsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const leads = useMemo(
    () => leadsData?.leads ?? leadsData ?? [],
    [leadsData]
  );

  const workflows = useMemo(
    () => workflowsData?.workflows ?? workflowsData ?? [],
    [workflowsData]
  );


  const leadMetrics = useMemo(() => deriveLeadMetrics(leads), [leads]);
  const workflowMetrics = useMemo(
    () => deriveWorkflowMetrics(workflows),
    [workflows]
  );
  const automationMetrics = useMemo(
    () => deriveAutomationMetrics(leads),
    [leads]
  );

  const isLoading = isLeadsLoading || isWfLoading;
  const isError = isLeadsError || isWfError;

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Analytics Dashboard
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          Track your lead follow-ups and workflow performance at a glance.
        </p>
      </div>

      {/* Refresh indicator */}
      {(isLeadsFetching || isWfFetching) && !isLoading && (
        <div className="h-0.5 rounded-full bg-blue-100 overflow-hidden">
          <div
            className="h-full bg-blue-500 animate-pulse"
            style={{ width: "60%" }}
          />
        </div>
      )}

      {isError ? (
        <div className="bg-white border border-red-100 rounded-2xl p-5">
          <p className="text-sm font-medium text-red-700">
            Failed to load analytics.
          </p>
          <p className="text-xs text-red-600 mt-1">
            Please refresh the page.
          </p>
        </div>
      ) : null}

      {/* Loading */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse"
            >
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-8 w-24 bg-gray-200 rounded mt-3" />
              <div className="h-3 w-32 bg-gray-200 rounded mt-4" />
            </div>
          ))}
        </div>
      ) : null}

      {/* Stats */}
      {!isLoading && !isError ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Leads"
            value={formatNumber(leadMetrics.total)}
            delta={leadMetrics.total ? "Live metrics" : "Start by adding leads"}
            positive
            bg="bg-blue-50"
            iconColor="text-blue-600"
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
              />
            }
          />
          <StatsCard
            title="Active Leads"
            value={formatNumber(leadMetrics.active)}
            delta="Currently running" 
            positive
            bg="bg-emerald-50"
            iconColor="text-emerald-600"
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            }
          />
          <StatsCard
            title="Responded Leads"
            value={formatNumber(leadMetrics.responded)}
            delta="Updated via status" 
            positive
            bg="bg-purple-50"
            iconColor="text-purple-600"
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
              />
            }
          />
          <StatsCard
            title="Paused Leads"
            value={formatNumber(leadMetrics.paused)}
            delta="Temporarily stopped" 
            positive={false}
            bg="bg-orange-50"
            iconColor="text-orange-600"
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 7h-1v10h1M9 7H8v10h1"
              />
            }
          />

          <StatsCard
            title="Total Workflows"
            value={formatNumber(workflowMetrics.total)}
            delta="Configured automation flows"
            positive
            bg="bg-indigo-50"
            iconColor="text-indigo-600"
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h10v10H7z"
              />
            }
          />
          <StatsCard
            title="Active Workflows"
            value={formatNumber(workflowMetrics.active)}
            delta="Backed by running leads"
            positive
            bg="bg-teal-50"
            iconColor="text-teal-600"
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 18l-3 3m0 0l-3-3m3 3V9"
              />
            }
          />
          <StatsCard
            title="Avg Steps / Workflow"
            value={
              workflowMetrics.avgSteps ? workflowMetrics.avgSteps.toFixed(1) : "0.0"
            }
            delta="Based on step counts"
            positive
            bg="bg-slate-50"
            iconColor="text-slate-600"
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 21v-7m0 7h3m-3 0l6-6 4 4 8-8"
              />
            }
          />
          <StatsCard
            title="Running Automations"
            value={formatNumber(automationMetrics.running)}
            delta="Leads in active state"
            positive
            bg="bg-blue-50"
            iconColor="text-blue-600"
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6l4 2"
              />
            }
          />
          <StatsCard
            title="Completed Automations"
            value={formatNumber(automationMetrics.completed)}
            delta="Finished follow-ups"
            positive
            bg="bg-emerald-50"
            iconColor="text-emerald-600"
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 6L9 17l-5-5"
              />
            }
          />
          <StatsCard
            title="Escalated Leads"
            value={formatNumber(automationMetrics.escalated)}
            delta="Escalation step detected"
            positive={false}
            bg="bg-rose-50"
            iconColor="text-rose-600"
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            }
          />
        </div>
      ) : null}

      {/* Charts */}
      {!isLoading && !isError ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <LeadsOverviewChart leads={leads} />
          </div>
          <div className="lg:col-span-1">
            <AutomationChart leads={leads} />
          </div>
          <div className="lg:col-span-1">
            <WorkflowChart workflows={workflows} />
          </div>
        </div>
      ) : null}

      {/* Bottom sections */}
      {!isLoading && !isError ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity leads={leads} workflows={workflows} />
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
              <h3 className="text-lg font-semibold text-gray-900">Insights</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="font-medium text-gray-900">Focus on responded leads</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Responded: {formatNumber(leadMetrics.responded)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="font-medium text-gray-900">Keep automations healthy</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Running: {formatNumber(automationMetrics.running)} • Completed: {formatNumber(automationMetrics.completed)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="font-medium text-gray-900">Workflow complexity</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Avg steps: {workflowMetrics.avgSteps ? workflowMetrics.avgSteps.toFixed(1) : "0.0"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DashboardPage;

