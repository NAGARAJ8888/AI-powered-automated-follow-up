import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-xl text-gray-600">
            Your AI-powered follow-up system is ready. 🚀
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center">
              <div className="p-4 bg-blue-100 rounded-2xl">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-6">
                <p className="text-3xl font-bold text-gray-900">1,234</p>
                <p className="text-gray-600">Active Contacts</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center">
              <div className="p-4 bg-emerald-100 rounded-2xl">
                <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-6">
                <p className="text-3xl font-bold text-gray-900">98%</p>
                <p className="text-gray-600">Follow-up Rate</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center">
              <div className="p-4 bg-purple-100 rounded-2xl">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-6">
                <p className="text-3xl font-bold text-gray-900">247</p>
                <p className="text-gray-600">This Month</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center">
              <div className="p-4 bg-orange-100 rounded-2xl">
                <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-6">
                <p className="text-3xl font-bold text-gray-900">12%</p>
                <p className="text-gray-600">Conversion ↑</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="group p-8 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl mb-4">📧</div>
                <h3 className="text-xl font-bold mb-2">New Follow-up</h3>
                <p className="opacity-90">Send immediate follow-up</p>
              </button>
              
              <button className="group p-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl mb-4">⚙️</div>
                <h3 className="text-xl font-bold mb-2">Workflows</h3>
                <p className="opacity-90">Manage automation rules</p>
              </button>
              
              <button className="group p-8 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2">Analytics</h3>
                <p className="opacity-90">View performance metrics</p>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { icon: '✅', text: 'John Doe responded to follow-up', time: '2 min ago' },
                { icon: '🔥', text: 'Sarah Wilson marked as hot lead', time: '1 hr ago' },
                { icon: '📧', text: 'Follow-up sent to 15 contacts', time: '3 hrs ago' },
                { icon: '⚡', text: 'Escalation triggered for Mike Chen', time: '5 hrs ago' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <span className="text-2xl mr-4">{activity.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{activity.text}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

