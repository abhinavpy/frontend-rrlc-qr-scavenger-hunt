import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    school: '',
    role: 'teacher', // Default role
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, isAuthenticated, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated && !successMessage) {
      if (currentUser.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/teacher/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, navigate, successMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.role === 'teacher' && !formData.school) {
      return setError('School is required for teacher registration.');
    }
    
    setLoading(true);
    
    try {
      // Prepare registration data
      const { confirmPassword, ...registrationData } = formData;
      
      // Remove school field if user is admin
      if (registrationData.role === 'admin') {
        delete registrationData.school;
      }

      const user = await register(registrationData);
      
      setSuccessMessage(`Registration successful! Welcome, ${user.name}. You will be redirected to your dashboard in 3 seconds.`);
      
      // Redirect after showing success message
      setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/teacher/dashboard', { replace: true });
        }
      }, 3000);

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wood-bg flex flex-col">
      <div className="bg-rrlc-brown p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-white text-lg font-semibold flex items-center hover:text-rrlc-gold-light transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            Back to Home
          </Link>
          <img 
            src="/logo.gif" 
            alt="RRLC Logo" 
            className="h-8 w-auto" // Slightly smaller for this header
          />
        </div>
      </div>
      
      <div className="flex-grow flex items-center justify-center py-8">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-rrlc-brown mb-6">
            Register Account
          </h2>
          
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
          
          {!successMessage && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="name">
                  Full Name
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
              
              <div className="mb-4">
                <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="role">
                  Register as
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                  disabled={loading}
                >
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              {formData.role === 'teacher' && (
                <div className="mb-4">
                  <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="school">
                    School
                  </label>
                  <input
                    id="school"
                    name="school"
                    type="text"
                    value={formData.school}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                    placeholder="Eureka Elementary"
                    required={formData.role === 'teacher'}
                    disabled={loading}
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                  placeholder="••••••••"
                  required
                  minLength="6"
                  disabled={loading}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                  placeholder="••••••••"
                  required
                  minLength="6"
                  disabled={loading}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-rrlc-green-medium text-white py-3 rounded-full font-medium 
                  ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-rrlc-green-dark transition duration-200'}`}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          )}
          
          {!successMessage && (
            <div className="mt-6 text-center">
              <p className="text-rrlc-charcoal">
                Already have an account?{' '}
                <Link to="/auth/login" className="text-rrlc-green-medium font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
      
      <footer className="bg-rrlc-charcoal text-white p-4 text-center">
        <p>© 2025 Redwood Region Logging Conference</p>
      </footer>
    </div>
  );
};

export default Register;