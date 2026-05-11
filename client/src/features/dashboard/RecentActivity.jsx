import { memo, useMemo } from "react";

const formatRelativeTime = (dateLike) => {
  const d = dateLike ? new Date(dateLike) : null;
  if (!d || Number.isNaN(d.getTime())) return "—";

  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);

  if (diffSec < 60) return `${diffSec} sec ago`;
  if (diffMin < 60) return `${diffMin} min ago`;
  return `${diffHr} hr ago`;
};

const RecentActivity = memo(function RecentActivity({ leads, workflows }) {
  const items = useMemo(() => {
    const leadList = Array.isArray(leads) ? leads : [];
    const wfList = Array.isArray(workflows) ? workflows : [];

    const leadEvents = leadList
      .map((l) => ({
        id: `lead-${l?._id ?? Math.random()}`,
        time: l?.createdAt ?? l?.created ?? l?._id,
        icon: "✅",
        text:
          l?.status
            ? `Lead ${l?.name ?? ""} marked as ${String(l.status)}`
            : "Lead created",
      }))
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 4);

    const wfEvents = wfList
      .map((w) => ({
        id: `wf-${w?._id ?? Math.random()}`,
        time: w?.createdAt ?? w?.created ?? w?._id,
        icon: "⚙️",
        text: `Workflow ${w?.name ?? ""} created`,
      }))
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 3);

    return [...leadEvents, ...wfEvents]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 6);
  }, [leads, workflows]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <span className="text-xs text-gray-500">Updates from leads & workflows</span>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-gray-500">No activity yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="text-lg leading-none mt-0.5">{item.icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.text}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatRelativeTime(item.time)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default RecentActivity;

