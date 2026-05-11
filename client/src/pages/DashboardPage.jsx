import { useSelector } from 'react-redux';

/**
 * DashboardPage — the /dashboard index route (Overview).
 * Rendered inside DashboardLayout — no Navbar or full-screen wrapper needed here.
 */
const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="p-6 sm:p-8">
      {/* Welcome header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || 'User'}! 👋
        </h2>
        <p className="text-gray-500 mt-1">
          Here&apos;s what&apos;s happening with your leads today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Active Contacts"
          value="1,234"
          delta="+12% this month"
          positive
          bg="bg-blue-50"
          iconColor="text-blue-600"
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          }
        />
        <StatCard
          label="Follow-up Rate"
          value="98%"
          delta="↑ 2% vs last week"
          positive
          bg="bg-emerald-50"
          iconColor="text-emerald-600"
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          }
        />
        <StatCard
          label="Sent This Month"
          value="247"
          delta="+33 from last month"
          positive
          bg="bg-purple-50"
          iconColor="text-purple-600"
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          }
        />
        <StatCard
          label="Conversion Rate"
          value="12%"
          delta="↑ 3% this quarter"
          positive
          bg="bg-orange-50"
          iconColor="text-orange-600"
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z" />
          }
        />
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ActionCard
              emoji="📧"
              title="New Follow-up"
              desc="Send immediate follow-up"
              gradient="from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            />
            <ActionCard
              emoji="⚙️"
              title="Workflows"
              desc="Manage automation rules"
              gradient="from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            />
            <ActionCard
              emoji="📊"
              title="Analytics"
              desc="View performance metrics"
              gradient="from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            />
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { icon: '✅', text: 'John Doe responded to follow-up', time: '2 min ago' },
              { icon: '🔥', text: 'Sarah Wilson marked as hot lead', time: '1 hr ago' },
              { icon: '📧', text: 'Follow-up sent to 15 contacts', time: '3 hrs ago' },
              { icon: '⚡', text: 'Escalation triggered for Mike Chen', time: '5 hrs ago' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <span className="text-lg leading-none mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.text}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const StatCard = ({ label, value, delta, positive, bg, iconColor, icon }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <div className="flex items-center gap-4">
      <div className={`p-3 ${bg} rounded-xl flex-shrink-0`}>
        <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
    <p className={`text-xs mt-3 font-medium ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
      {delta}
    </p>
  </div>
);

const ActionCard = ({ emoji, title, desc, gradient }) => (
  <button
    className={`flex flex-col items-start p-5 rounded-xl bg-gradient-to-r ${gradient} text-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 text-left`}
  >
    <span className="text-3xl mb-3">{emoji}</span>
    <p className="font-semibold text-base">{title}</p>
    <p className="text-sm opacity-85 mt-0.5">{desc}</p>
  </button>
);

export default DashboardPage;
