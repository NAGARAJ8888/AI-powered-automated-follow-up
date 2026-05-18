import { memo } from "react";

const StatsCard = memo(function StatsCard({
  title,
  metric,
  value,
  delta,
  positive = true,
  icon,
  bg = "bg-blue-50",
  iconColor = "text-blue-600",
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
            {value}
          </p>
          {typeof delta === "string" && (
            <p
              className={`text-xs mt-3 font-medium ${
                positive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {delta}
            </p>
          )}
        </div>

        <div className={`${bg} ${iconColor} p-3 rounded-xl flex-shrink-0 dark:bg-gray-800/50 dark:backdrop-blur`}>
          {icon ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {icon}
            </svg>
          ) : null}
        </div>
      </div>

      {metric ? (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{metric}</p>
      ) : null}
    </div>
  );
});

export default StatsCard;

