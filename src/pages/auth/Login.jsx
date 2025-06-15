import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, currentUser, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const role = location.state?.role || 'teacher';

  useEffect(() => {
    if (isAuthenticated) {
      if (currentUser.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/teacher/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/teacher/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wood-bg flex flex-col">
      <div className="bg-rrlc-brown p-4">
        <div className="container mx-auto flex items-center justify-start"> {/* Changed to justify-start */}
          <Link to="/" className="text-white text-lg font-semibold flex items-center hover:text-rrlc-gold-light transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            Back to Home
          </Link>
          {/* Logo removed from here */}
        </div>
      </div>
      
      <div className="flex-grow flex items-center justify-center py-8 px-4"> {/* Added py-8 px-4 for padding */}
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"> {/* Increased shadow to shadow-xl */}
          <div className="flex justify-center mb-6"> {/* Centering container for logo */}
            <img 
              src="/logo.gif" 
              alt="RRLC Logo" 
              className="h-16 w-auto" // Adjusted size for card
            />
          </div>
          <h2 className="text-2xl font-bold text-center text-rrlc-brown mb-6">
            {role === 'admin' ? 'Admin Login' : 'Teacher Login'}
          </h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm"> {/* Made error text smaller */}
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium" // Added rounded-md
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium" // Added rounded-md
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-rrlc-green-medium text-white py-3 rounded-full font-semibold 
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-rrlc-green-dark transition duration-300 ease-in-out transform hover:-translate-y-0.5'}`} // Added hover effect
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : 'Sign In'}
            </button>
            {loading && (
              <p className="text-xs text-rrlc-charcoal mt-3 text-center">
                This might take more than a minute if the server wasn't accessed in a while, please wait patiently. (Cold start)
              </p>
            )}
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-rrlc-charcoal"> {/* Made text smaller */}
              Don't have an account?{' '}
              <Link to="/auth/register" state={{ role: role }} className="text-rrlc-green-medium font-semibold hover:underline"> {/* Added hover:underline and passed role state */}
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <footer className="bg-rrlc-charcoal text-white p-4 text-center text-sm"> {/* Made text smaller */}
        <p>© {new Date().getFullYear()} Redwood Region Logging Conference</p>
      </footer>
    </div>
  );
};

export default Login;