import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  activeBorrows: number;
  pendingReservations: number;
  totalFines: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    totalUsers: 0,
    activeBorrows: 0,
    pendingReservations: 0,
    totalFines: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Mock data - replace with actual API calls
    setStats({
      totalBooks: 1247,
      totalUsers: 543,
      activeBorrows: 89,
      pendingReservations: 23,
      totalFines: 1250
    });
    
    setRecentActivity([
      { type: 'borrow', user: 'John Doe', book: 'The Great Gatsby', time: '2 hours ago' },
      { type: 'return', user: 'Jane Smith', book: 'To Kill a Mockingbird', time: '4 hours ago' },
      { type: 'reservation', user: 'Mike Johnson', book: '1984', time: '6 hours ago' },
      { type: 'fine_payment', user: 'Sarah Wilson', amount: 25, time: '1 day ago' }
    ]);
  };

  const StatCard: React.FC<{ title: string; value: number; icon: string; color: string; link: string }> = 
    ({ title, value, icon, color, link }) => (
    <Link to={link} className="block">
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${color} mr-4`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your library management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard 
          title="Total Books" 
          value={stats.totalBooks} 
          icon="📚" 
          color="bg-blue-100 text-blue-600" 
          link="/books"
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon="👥" 
          color="bg-green-100 text-green-600" 
          link="/users"
        />
        <StatCard 
          title="Active Borrows" 
          value={stats.activeBorrows} 
          icon="📖" 
          color="bg-yellow-100 text-yellow-600" 
          link="/borrow"
        />
        <StatCard 
          title="Pending Reservations" 
          value={stats.pendingReservations} 
          icon="⏰" 
          color="bg-purple-100 text-purple-600" 
          link="/reservations"
        />
        <StatCard 
          title="Total Fines" 
          value={stats.totalFines} 
          icon="💰" 
          color="bg-red-100 text-red-600" 
          link="/fines"
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <span className="text-sm text-blue-600 font-medium">View All</span>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3  hover:bg-gray-200 rounded-lg transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'borrow' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'return' ? 'bg-green-100 text-green-600' :
                  activity.type === 'reservation' ? 'bg-purple-100 text-purple-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {activity.type === 'borrow' ? '📖' :
                   activity.type === 'return' ? '↩️' :
                   activity.type === 'reservation' ? '⏰' : '💰'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.user} {activity.type === 'fine_payment' 
                      ? `paid $${activity.amount} fine` 
                      : `${activity.type}ed "${activity.book}"`}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/books?action=add"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center group"
            >
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">📚</span>
              <span className="text-sm font-medium text-gray-700">Add New Book</span>
            </Link>
            <Link
              to="/users?action=add"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center group"
            >
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">👥</span>
              <span className="text-sm font-medium text-gray-700">Add New User</span>
            </Link>
            <Link
              to="/borrow"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center group"
            >
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">📖</span>
              <span className="text-sm font-medium text-gray-700">Issue Book</span>
            </Link>
            <Link
              to="/fines"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors text-center group"
            >
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">💰</span>
              <span className="text-sm font-medium text-gray-700">Process Fine</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;