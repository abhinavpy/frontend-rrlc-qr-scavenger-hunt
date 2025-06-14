// filepath: c:\Users\91895\OneDrive\Desktop\OpportunityHack_SummerInternship\frontend\src\pages\admin\lists\TeachersList.jsx
import { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient'; // Import apiClient
import Layout from '../../../components/common/Layout';
import { Link } from 'react-router-dom';

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError(null);
        // Use apiClient for the request
        const response = await apiClient.get('/api/admin/teachers-list');
        setTeachers(response.data.data);
      } catch (err) {
        console.error('Error fetching teachers:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to load teachers list.');
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
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

  const isValidImageUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      // Basic check for common image extensions
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    } catch {
      return false;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-rrlc-brown">Teachers List</h1>
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
        ) : teachers.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {teachers.length} registered teacher{teachers.length !== 1 ? 's' : ''}
              </p>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {teacher.profilePicture && isValidImageUrl(teacher.profilePicture) ? (
                          <img
                            src={teacher.profilePicture}
                            alt={teacher.name}
                            className="h-12 w-12 rounded-full object-cover mr-4"
                            onError={(e) => {
                              // Fallback if image fails to load
                              e.target.style.display = 'none';
                              const fallback = e.target.nextElementSibling;
                              if (fallback && fallback.classList.contains('fallback-avatar')) {
                                fallback.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        {/* Always render fallback, hide with CSS if image loads */}
                        <div 
                          className={`h-12 w-12 rounded-full bg-rrlc-green-medium flex items-center justify-center mr-4 fallback-avatar ${teacher.profilePicture && isValidImageUrl(teacher.profilePicture) ? 'hidden-by-default' : ''}`}
                          style={{ display: (teacher.profilePicture && isValidImageUrl(teacher.profilePicture)) ? 'none' : 'flex' }} // Initial state
                        >
                          <span className="text-white text-lg font-semibold">
                            {teacher.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                          {teacher.bio && (
                            <div className="text-sm text-gray-500 max-w-xs truncate">{teacher.bio}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{teacher.email}</div>
                      {teacher.phone && (
                        <div className="text-sm text-gray-500">{teacher.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teacher.school || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(teacher.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(teacher.lastLogin)}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No teachers registered</h3>
            <p className="mt-1 text-sm text-gray-500">
              Teachers who register will appear here.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TeachersList;