// filepath: c:\Users\91895\OneDrive\Desktop\OpportunityHack_SummerInternship\frontend\src\pages\admin\Analytics.jsx
import { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient'; // Import apiClient
import Layout from '../../components/common/Layout';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    overview: {},
    gradeDistribution: [],
    stationHeatmap: [],
    timePatterns: [],
    completionTimes: [],
    engagement: {},
    historical: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(dateRange);
      
      const [overviewRes, heatmapRes, timeRes, engagementRes, historicalRes] = await Promise.all([
        apiClient.get(`/api/analytics/overview?${params}`),
        apiClient.get(`/api/analytics/station-heatmap?${params}`),
        apiClient.get(`/api/analytics/time-patterns?${params}`),
        apiClient.get(`/api/analytics/engagement?${params}`),
        apiClient.get('/api/analytics/historical')
      ]);

      setAnalytics({
        overview: overviewRes.data.data.overview,
        gradeDistribution: overviewRes.data.data.gradeDistribution,
        stationHeatmap: heatmapRes.data.data,
        timePatterns: timeRes.data.data.timePatterns,
        completionTimes: timeRes.data.data.completionTimes,
        engagement: engagementRes.data.data,
        historical: historicalRes.data.data
      });
    } catch (err) {
      // Using the error handling from your "current visible code" attachment
      setError('Failed to load analytics data');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'];

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rrlc-green-medium"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-rrlc-brown">Analytics Dashboard</h1>
          
          {/* Date Range Selector */}
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'engagement', name: 'Engagement' },
              { id: 'heatmap', name: 'Station Heatmap' },
              { id: 'time', name: 'Time Analysis' },
              { id: 'historical', name: 'Historical' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-rrlc-green-medium text-rrlc-green-dark'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Classes"
                value={analytics.overview.totalClasses || 0}
                icon="👥"
                color="bg-blue-500"
              />
              <MetricCard
                title="Completed Classes"
                value={analytics.overview.completedClasses || 0}
                subtitle={`${analytics.overview.completionRate || 0}% completion rate`}
                icon="✅"
                color="bg-green-500"
              />
              <MetricCard
                title="Total Scans"
                value={analytics.overview.totalScans || 0}
                icon="📱"
                color="bg-purple-500"
              />
              <MetricCard
                title="Avg Completion Time"
                value={`${analytics.overview.avgCompletionTime || 0} min`}
                icon="⏱️"
                color="bg-orange-500"
              />
            </div>

            {/* Grade Distribution Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-rrlc-brown mb-4">Participation by Grade</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#10B981" name="Classes" />
                  <Bar dataKey="students" fill="#3B82F6" name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Engagement Tab */}
        {activeTab === 'engagement' && (
          <div className="space-y-6">
            {/* Engagement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-rrlc-brown mb-2">Scan Velocity</h3>
                <p className="text-3xl font-bold text-rrlc-green-dark">
                  {analytics.engagement.scanVelocity?.avgScansPerClass?.toFixed(1) || 0}
                </p>
                <p className="text-sm text-gray-600">Average scans per class</p>
                <p className="text-sm text-gray-500 mt-2">
                  Avg time: {analytics.engagement.scanVelocity?.avgTimeSpent?.toFixed(0) || 0} minutes
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-rrlc-brown mb-2">Dropout Rate</h3>
                <p className="text-3xl font-bold text-red-500">
                  {analytics.engagement.dropoutAnalysis ? 
                    Math.round(((analytics.engagement.dropoutAnalysis.classesWithScans - analytics.engagement.dropoutAnalysis.completedClasses) / 
                    analytics.engagement.dropoutAnalysis.classesWithScans) * 100) || 0 : 0}%
                </p>
                <p className="text-sm text-gray-600">Classes that started but didn't finish</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-rrlc-brown mb-2">Avg Stations Scanned</h3>
                <p className="text-3xl font-bold text-rrlc-green-dark">
                  {analytics.engagement.dropoutAnalysis?.avgStationsScanned?.toFixed(1) || 0}
                </p>
                <p className="text-sm text-gray-600">Per class on average</p>
              </div>
            </div>

            {/* School Participation */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-rrlc-brown mb-4">School Participation</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">School</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.engagement.schoolParticipation?.map((school, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {school.school}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {school.classCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {school.totalStudents}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            school.completionRate >= 80 ? 'bg-green-100 text-green-800' :
                            school.completionRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {school.completionRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Station Heatmap Tab */}
        {activeTab === 'heatmap' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-rrlc-brown mb-4">Station Popularity Heatmap</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics.stationHeatmap.slice(0, 20)} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="scanCount" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Station List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-rrlc-brown mb-4">Station Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.stationHeatmap.map((station, index) => (
                  <div
                    key={station.stationId}
                    className={`p-4 rounded-lg border-2 ${
                      station.scanCount === 0 ? 'border-red-200 bg-red-50' :
                      station.scanCount < 5 ? 'border-yellow-200 bg-yellow-50' :
                      'border-green-200 bg-green-50'
                    }`}
                  >
                    <h4 className="font-medium text-gray-900">{station.name}</h4>
                    <p className="text-sm text-gray-600">{station.location}</p>
                    <p className={`text-lg font-bold mt-2 ${
                      station.scanCount === 0 ? 'text-red-600' :
                      station.scanCount < 5 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {station.scanCount} scans
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Time Analysis Tab */}
        {activeTab === 'time' && (
          <div className="space-y-6">
            {/* Hourly Patterns */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-rrlc-brown mb-4">Scan Activity by Hour</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.timePatterns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="scanCount" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Completion Time Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-rrlc-brown mb-4">Completion Time Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.completionTimes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Peak Usage Times */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-rrlc-brown mb-4">Peak Usage Times</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analytics.engagement.peakUsage?.slice(0, 6).map((peak, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium">
                      {peak._id.hour}:00 - Day {peak._id.dayOfWeek}
                    </p>
                    <p className="text-2xl font-bold text-rrlc-green-dark">{peak.scanCount} scans</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Historical Tab */}
        {activeTab === 'historical' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-rrlc-brown mb-4">Year-over-Year Comparison</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analytics.historical}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="totalClasses" stroke="#10B981" name="Total Classes" />
                  <Line type="monotone" dataKey="completedClasses" stroke="#3B82F6" name="Completed Classes" />
                  <Line type="monotone" dataKey="totalStudents" stroke="#F59E0B" name="Total Students" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analytics.historical.map((year, index) => (
                <div key={year.year} className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-xl font-bold text-rrlc-brown mb-4">{year.year}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Classes:</span>
                      <span className="font-medium">{year.totalClasses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Students:</span>
                      <span className="font-medium">{year.totalStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completion Rate:</span>
                      <span className="font-medium">{year.completionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Scans:</span>
                      <span className="font-medium">{year.totalScans}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, subtitle, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center">
      <div className={`${color} rounded-lg p-3 mr-4`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  </div>
);

export default Analytics;