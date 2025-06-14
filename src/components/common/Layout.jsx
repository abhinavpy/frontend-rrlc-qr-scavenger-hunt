import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const Layout = ({ children }) => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = currentUser?.role === 'admin';

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
    setMobileMenuOpen(false);
  };

  // Update the navLinks for admin:
  const navLinks = isAdmin 
    ? [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Stations', path: '/admin/stations' },
        { name: 'Analytics', path: '/admin/analytics' }, // Add this line
        { name: 'Drawing', path: '/admin/drawing' }
      ]
    : [
        { name: 'Dashboard', path: '/teacher/dashboard' },
        { name: 'Scan QR', path: '/teacher/scan' }
      ];

  const userName = currentUser?.name || currentUser?.email || 'User';
  const userEmail = currentUser?.email || 'No email available';

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
    <div className="min-h-screen flex flex-col">
      <header className="bg-rrlc-brown text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to={isAdmin ? "/admin/dashboard" : "/teacher/dashboard"} className="flex items-center text-xl font-bold text-rrlc-gold hover:text-rrlc-gold-light transition-colors">
            <img 
              src="/logo1.avif" 
              alt="RRLC Logo" 
              className="h-10 w-auto mr-3" // Adjust height (h-10) as needed, w-auto maintains aspect ratio
            />
            RRLC Education Hunt
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-rrlc-green-dark transition-colors ${
                  location.pathname === link.path ? 'bg-rrlc-green-medium' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* User Dropdown with Profile Picture */}
            {currentUser && (
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
                  
                  <span className="hidden lg:block">{userName}</span>
                  <ChevronDownIcon className="h-5 w-5" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          {currentUser.profilePicture && isValidImageUrl(currentUser.profilePicture) ? (
                            <img
                              src={currentUser.profilePicture}
                              alt={currentUser.name}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-rrlc-green-medium flex items-center justify-center">
                              <span className="text-white text-lg font-semibold">
                                {currentUser.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                            <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                            <p className="text-xs text-gray-400 capitalize">{currentUser.role}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Link
                        to="/profile/edit"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                      </Link>

                      <Link
                        to={isAdmin ? '/admin/dashboard' : '/teacher/dashboard'}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        </svg>
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-rrlc-gold focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-rrlc-brown-dark">
            <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-rrlc-green-dark transition-colors ${
                    location.pathname === link.path ? 'bg-rrlc-green-medium' : 'text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {currentUser && (
                <>
                  <div className="px-3 py-3 border-t border-gray-700">
                    <div className="flex items-center space-x-3">
                      {currentUser.profilePicture && isValidImageUrl(currentUser.profilePicture) ? (
                        <img
                          src={currentUser.profilePicture}
                          alt={currentUser.name}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-rrlc-gold flex items-center justify-center">
                          <span className="text-rrlc-brown text-lg font-semibold">
                            {currentUser.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{userName}</p>
                        <p className="text-xs text-gray-300 truncate">{userEmail}</p>
                        <p className="text-xs text-gray-400 capitalize">{currentUser.role}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    to="/profile/edit"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-rrlc-green-dark"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-rrlc-green-dark"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-grow bg-rrlc-parchment">
        {children}
      </main>

      <footer className="bg-rrlc-charcoal text-white p-4 text-center text-sm">
        <p>© {new Date().getFullYear()} Redwood Region Logging Conference. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;