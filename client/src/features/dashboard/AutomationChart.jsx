import { memo, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const labelFromStatus = (s) => {
  const v = String(s || "").toLowerCase();
  if (!v) return "Unknown";
  return v.charAt(0).toUpperCase() + v.slice(1);
};

const AutomationChart = memo(function AutomationChart({ leads }) {
  const data = useMemo(() => {
    const list = Array.isArray(leads) ? leads : [];
    const counts = new Map();

    for (const lead of list) {
      const raw = lead?.automationStatus ?? lead?.automation;
      const key = typeof raw === "string" ? raw.toLowerCase() : raw;
      const label = labelFromStatus(key);
      counts.set(label, (counts.get(label) || 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
  }, [leads]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Automation Status</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">Running vs completed</span>
      </div>

      {data.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">No automation statuses yet.</div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
});

export default AutomationChart;

