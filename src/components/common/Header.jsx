import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
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
    <header className="bg-rrlc-brown text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-rrlc-gold">
          RRLC Education Hunt
        </Link>
        
        <nav className="flex items-center space-x-6">
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 hover:text-rrlc-gold transition duration-200 focus:outline-none"
              >
                {/* Profile Picture */}
                {currentUser.profilePicture && isValidImageUrl(currentUser.profilePicture) ? (
                  <img
                    src={currentUser.profilePicture}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-rrlc-gold"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-rrlc-gold flex items-center justify-center">
                    <span className="text-rrlc-brown text-sm font-semibold">
                      {currentUser.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
                
                <span className="hidden md:block">{currentUser.name}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                    <p className="text-sm text-gray-500">{currentUser.email}</p>
                    <p className="text-xs text-gray-400 capitalize">{currentUser.role}</p>
                  </div>
                  
                  <Link
                    to="/profile/edit"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </div>
                  </Link>

                  <Link
                    to={currentUser.role === 'admin' ? '/admin/dashboard' : '/teacher/dashboard'}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      </svg>
                      Dashboard
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition duration-200"
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/auth/login" className="hover:text-rrlc-gold transition duration-200">
                Sign In
              </Link>
              <Link to="/auth/register" className="bg-rrlc-gold text-rrlc-brown px-4 py-2 rounded-full hover:bg-yellow-400 transition duration-200">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;