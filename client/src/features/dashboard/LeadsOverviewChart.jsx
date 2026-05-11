import { memo, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#2563eb", // blue
  "#f59e0b", // amber
  "#7c3aed", // purple
  "#16a34a", // green
  "#dc2626", // red
  "#6b7280", // gray
];

const niceLabel = (value) => {
  if (!value) return "Unknown";
  const s = String(value);
  return s.length > 18 ? `${s.slice(0, 18)}…` : s;
};

const LeadsOverviewChart = memo(function LeadsOverviewChart({ leads }) {
  const data = useMemo(() => {
    const list = Array.isArray(leads) ? leads : [];
    const counts = new Map();

    for (const lead of list) {
      const raw = lead?.status ?? lead?.leadStatus ?? lead?.automationStatus;
      const key = typeof raw === "string" ? raw.toLowerCase() : raw;
      const label = key ?? "unknown";
      counts.set(label, (counts.get(label) || 0) + 1);
    }

    const result = Array.from(counts.entries()).map(([k, v], idx) => ({
      name: niceLabel(k),
      value: v,
      fill: COLORS[idx % COLORS.length],
    }));

    // stable sort by value desc, then name
    result.sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
    return result;
  }, [leads]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Status Distribution</h3>
        <span className="text-xs text-gray-500">Leads by status</span>
      </div>

      {data.length === 0 ? (
        <div className="text-sm text-gray-500">No lead statuses yet.</div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(value) => [`${value}`, "Count"]}
                labelFormatter={(label) => `${label}`}
              />
              <Legend
                verticalAlign="middle"
                align="right"
                layout="vertical"
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="40%"
                cy="50%"
                outerRadius={90}
                labelLine={false}
              >
                {data.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
});

export default LeadsOverviewChart;

