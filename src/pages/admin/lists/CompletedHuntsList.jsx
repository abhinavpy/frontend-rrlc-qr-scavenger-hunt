// filepath: c:\Users\91895\OneDrive\Desktop\OpportunityHack_SummerInternship\frontend\src\pages\admin\lists\CompletedHuntsList.jsx
import { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient'; // Import apiClient
import Layout from '../../../components/common/Layout';
import { Link } from 'react-router-dom';

const CompletedHuntsList = () => {
  const [completedHunts, setCompletedHunts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompletedHunts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Use apiClient for the request
        const response = await apiClient.get('/api/admin/completed-hunts');
        setCompletedHunts(response.data.data);
      } catch (err) {
        console.error('Error fetching completed hunts:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to load completed hunts list.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedHunts();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCompletionTime = (hours) => {
    if (!hours || hours <= 0) return 'N/A';
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
    return `${hours.toFixed(1)} hour${hours !== 1 ? 's' : ''}`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-rrlc-brown">Completed Hunts</h1>
          <Link to="/admin/dashboard" className="text-rrlc-green-medium hover:text-rrlc-green-dark">
            &larr; Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rrlc-green-medium"></div>
          </div>
        ) : completedHunts.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {completedHunts.length} completed hunt{completedHunts.length !== 1 ? 's' : ''}
              </p>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed On
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {completedHunts.map((hunt) => (
                  <tr key={hunt._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{hunt.name}</div>
                        <div className="text-sm text-gray-500">
                          {hunt.school} • Grade {hunt.grade}
                        </div>
                        <div className="text-xs text-gray-400">
                          {hunt.studentCount} student{hunt.studentCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{hunt.teacher?.name || 'N/A'}</div>
                      {hunt.teacher?.email && (
                        <div className="text-xs text-gray-500">{hunt.teacher.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Complete
                          </span>
                        </div>
                        <div className="ml-2 text-sm text-gray-500">
                          {hunt.stationsScanned}/{hunt.totalStations} stations
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(hunt.completedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCompletionTime(hunt.completionTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No completed hunts</h3>
            <p className="mt-1 text-sm text-gray-500">
              Classes that complete all stations will appear here.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CompletedHuntsList;