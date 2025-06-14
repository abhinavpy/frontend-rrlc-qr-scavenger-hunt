import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient'; // Import apiClient
import Layout from '../../components/common/Layout';
import { AuthContext } from '../../contexts/AuthContext';

const EditProfile = () => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    profilePicture: '',
    bio: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        school: currentUser.school || '',
        profilePicture: currentUser.profilePicture || '',
        bio: currentUser.bio || '',
        phone: currentUser.phone || ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await apiClient.put('/api/auth/profile', formData); // Use apiClient
      
      // Update user context
      if (updateUser) {
        updateUser(response.data.user);
      }
      
      setSuccessMessage('Profile updated successfully!');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        if (currentUser.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/teacher/dashboard');
        }
      }, 2000);

    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const isValidImageUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    } catch {
      return false;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-rrlc-brown p-6 text-white">
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p className="text-rrlc-gold mt-1">Update your account information</p>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {successMessage}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Profile Picture Preview */}
              <div className="mb-6 text-center">
                <div className="relative inline-block">
                  {formData.profilePicture && isValidImageUrl(formData.profilePicture) ? (
                    <img
                      src={formData.profilePicture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-rrlc-green-medium"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-rrlc-green-medium flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="name">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                    placeholder="John Doe"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                    placeholder="(555) 123-4567"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email (Read-only) */}
              <div className="mb-6">
                <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={currentUser?.email || ''}
                  className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-600"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* School (for teachers) */}
              {currentUser?.role === 'teacher' && (
                <div className="mb-6">
                  <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="school">
                    School *
                  </label>
                  <input
                    id="school"
                    name="school"
                    type="text"
                    value={formData.school}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                    placeholder="Lincoln Elementary School"
                    required={currentUser?.role === 'teacher'}
                    disabled={loading}
                  />
                </div>
              )}

              {/* Profile Picture URL */}
              <div className="mb-6">
                <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="profilePicture">
                  Profile Picture URL
                </label>
                <input
                  id="profilePicture"
                  name="profilePicture"
                  type="url"
                  value={formData.profilePicture}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                  placeholder="https://example.com/your-photo.jpg"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a direct link to your profile picture (jpg, png, gif formats supported)
                </p>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="bio">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  maxLength="500"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                  placeholder="Tell us a little about yourself..."
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition duration-200"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-3 bg-rrlc-green-medium text-white rounded-full font-medium 
                    ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-rrlc-green-dark transition duration-200'}`}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditProfile;