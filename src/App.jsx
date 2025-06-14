import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import TeacherDashboard from './pages/teacher/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import StationManagement from './pages/admin/StationManagement';
import DrawingSystem from './pages/admin/DrawingSystem';
import QrScanner from './pages/hunt/QrScanner';
import Unauthorized from './pages/Unauthorized';
import EditProfile from './pages/profile/EditProfile'; // Add this import
import Analytics from './pages/admin/Analytics'; // Add the import

// Import new list pages
import TeachersList from './pages/admin/lists/TeachersList';
import AllClassesList from './pages/admin/lists/AllClassesList';
import CompletedHuntsList from './pages/admin/lists/CompletedHuntsList';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-wood-bg">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Profile route - accessible to both teachers and admins */}
            <Route path="/profile/edit" element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <EditProfile />
              </ProtectedRoute>
            } />
            
            {/* Protected routes - Teacher */}
            <Route path="/teacher/*" element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <Routes>
                  <Route path="dashboard" element={<TeacherDashboard />} />
                  <Route path="scan" element={<QrScanner />} />
                  <Route path="*" element={<Navigate to="/teacher/dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            } />
            
            {/* Protected routes - Admin */}
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="stations" element={<StationManagement />} />
                  <Route path="drawing" element={<DrawingSystem />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="teachers-list" element={<TeachersList />} />
                  <Route path="all-classes" element={<AllClassesList />} />
                  <Route path="completed-hunts" element={<CompletedHuntsList />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} /> 
                </Routes>
              </ProtectedRoute>
            } />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;