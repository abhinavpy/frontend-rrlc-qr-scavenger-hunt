import { createContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient'; // Import your new apiClient
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if token exists and is valid
    const verifyToken = async () => {
      if (token) {
        try {
          // apiClient's request interceptor will handle setting the Authorization header
          
          // Decode token to get user info without making a request
          const decoded = jwtDecode(token);
          
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            setToken(null);
            setCurrentUser(null);
          } else {
            // Fetch current user data using apiClient
            const response = await apiClient.get('/api/auth/me');
            setCurrentUser(response.data.data);
          }
        } catch (err) {
          console.error('Token verification error:', err);
          localStorage.removeItem('token');
          setToken(null);
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      // Use apiClient for the login request
      const response = await apiClient.post('/api/auth/login', { email, password });
      const { token: newToken, user } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setCurrentUser(user);
      // apiClient's request interceptor will use the new token from localStorage
      return user;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      // Use apiClient for the register request
      const response = await apiClient.post('/api/auth/register', userData);
      const { token: newToken, user } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setCurrentUser(user);
      // apiClient's request interceptor will use the new token from localStorage
      return user;
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    // No need to delete global headers, apiClient handles its own
  };

  // Fix updateUser function
  const updateUser = (updatedUserData) => {
    const updatedUser = { ...currentUser, ...updatedUserData };
    setCurrentUser(updatedUser);
    // Don't store user in localStorage separately since we get it from token
  };

  // Include updateUser in the context value
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!token && !!currentUser,
    token // Exposing token if needed elsewhere, though typically not directly
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};