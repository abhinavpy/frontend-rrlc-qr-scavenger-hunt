import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/apiClient'; // Import apiClient
import Layout from '../../components/common/Layout';
import { AuthContext } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  useContext(AuthContext);

  const [stats, setStats] = useState(null);
  const [recentClasses, setRecentClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const statsPromise = apiClient.get('/api/admin/stats'); // Use apiClient
        const classesPromise = apiClient.get('/api/admin/recent-activity?limit=5'); // Use apiClient

        const [statsResponse, classesResponse] = await Promise.all([statsPromise, classesPromise]);
        
        setStats(statsResponse.data.data);
        setRecentClasses(classesResponse.data.data);
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to load dashboard data. Please ensure API endpoints are available and you are authorized.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ title, value, color = 'rrlc-green-medium', linkTo }) => (
    <Link to={linkTo} className={`block bg-${color} p-6 rounded-lg shadow-md text-white hover:opacity-90 transition-opacity`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value ?? 'N/A'}</p>
    </Link>
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressBarColor = (percentage) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getStatusBadge = (isCompleted, progressPercentage) => {
    if (isCompleted) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Complete
        </span>
      );
    }
    if (progressPercentage > 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Not Started
      </span>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-rrlc-brown mb-6">Admin Dashboard</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rrlc-green-medium"></div>
          </div>
        ) : stats ? (
          <>
            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Teachers" value={stats?.totalTeachers} linkTo="/admin/teachers-list" />
              <StatCard title="Total Classes" value={stats?.totalClasses} color="rrlc-green-dark" linkTo="/admin/all-classes" />
              <StatCard title="Active Stations" value={stats?.activeStations} linkTo="/admin/stations" />
              <StatCard title="Completed Hunts" value={stats?.completedHunts} color="rrlc-gold text-rrlc-brown" linkTo="/admin/completed-hunts" />
            </div>

            {/* Quick Links Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-rrlc-brown mb-4">Quick Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/admin/stations" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold text-rrlc-green-medium">Manage Stations</h3>
                  <p className="text-sm text-rrlc-charcoal mt-1">Add, edit, and manage QR code stations.</p>
                </Link>
                <Link to="/admin/drawing" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold text-rrlc-green-medium">Conduct Drawing</h3>
                  <p className="text-sm text-rrlc-charcoal mt-1">Run the prize drawing for completed classes.</p>
                </Link>
                <Link to="/admin/all-classes" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold text-rrlc-green-medium">View All Classes</h3>
                  <p className="text-sm text-rrlc-charcoal mt-1">See all registered classes and their progress.</p>
                </Link>
              </div>
            </div>
            
            {/* Recent Activity Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-rrlc-brown">Recent Class Activity</h2>
                <Link to="/admin/all-classes" className="text-sm text-rrlc-green-medium hover:text-rrlc-green-dark">
                  View All Classes →
                </Link>
              </div>
              {recentClasses && recentClasses.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Class
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Teacher
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Activity
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentClasses.map((activity) => (
                        <tr key={activity._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {activity.className || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {activity.school}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {activity.teacherName || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(activity.isCompleted, activity.progress?.progressPercentage || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {activity.progress ? (
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className={`h-2 rounded-full ${getProgressBarColor(activity.progress.progressPercentage)}`}
                                    style={{ width: `${activity.progress.progressPercentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {activity.progress.completedCount}/{activity.progress.totalStations}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {activity.isCompleted ? (
                              <div>
                                <div className="font-medium">Completed</div>
                                <div className="text-xs">{formatDate(activity.completedAt || activity.lastScanAt)}</div>
                              </div>
                            ) : (
                              formatDate(activity.lastScanAt)
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-rrlc-charcoal">No recent activity to display.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Class activity will appear here once teachers start scanning QR codes.
                  </p>
                </div>
              )}
            </div>

            {/* Analytics Card - New Section */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Link 
                to="/admin/analytics"
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="bg-purple-500 rounded-lg p-3 mr-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Analytics</h3>
                    <p className="text-sm text-gray-500">View detailed insights</p>
                  </div>
                </div>
              </Link>
            </div> */}
          </>
        ) : !loading && !error ? (
            <p className="text-rrlc-charcoal">No statistics data available.</p>
        ) : null } 
      </div>
    </Layout>
  );
};

export default AdminDashboard;