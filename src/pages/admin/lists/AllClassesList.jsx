// filepath: c:\Users\91895\OneDrive\Desktop\OpportunityHack_SummerInternship\frontend\src\pages\admin\lists\AllClassesList.jsx
import { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient'; // Import apiClient
import Layout from '../../../components/common/Layout';
import { Link } from 'react-router-dom';

const AllClassesList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        // Use apiClient for the request
        const response = await apiClient.get('/api/admin/all-classes');
        setClasses(response.data.data);
      } catch (err) {
        console.error('Error fetching classes:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to load classes list.');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-rrlc-brown">All Classes</h1>
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
        ) : classes.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classes.map((cls) => (
                  <tr key={cls._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cls.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.teacher?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.school}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.grade}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.studentCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(cls.registeredAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.isCompleted ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-rrlc-charcoal">No classes found.</p>
        )}
      </div>
    </Layout>
  );
};

export default AllClassesList;