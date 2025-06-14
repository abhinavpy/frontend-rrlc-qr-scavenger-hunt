import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-wood-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rrlc-green-medium"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check if user has required role (if specified)
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect to unauthorized page or home
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;