import { memo, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const WorkflowChart = memo(function WorkflowChart({ workflows }) {
  const data = useMemo(() => {
    const list = Array.isArray(workflows) ? workflows : [];

    // Step count distribution: buckets by exact step count
    const counts = new Map();

    for (const wf of list) {
      const steps = Array.isArray(wf?.steps) ? wf.steps : [];
      const n = steps.length;
      counts.set(n, (counts.get(n) || 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([stepCount, value]) => ({ stepCount: String(stepCount), value }))
      .sort((a, b) => Number(a.stepCount) - Number(b.stepCount));
  }, [workflows]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Workflow Step Count</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">Distribution across workflows</span>
      </div>

      {data.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">No workflows yet.</div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="stepCount" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                fill="#a78bfa"
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
});

export default WorkflowChart;

