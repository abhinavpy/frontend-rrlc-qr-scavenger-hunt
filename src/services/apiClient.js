import axios from 'axios';

const frontendEnv = import.meta.env.VITE_FRONTEND_ENV;
const devApiUrl = import.meta.env.VITE_API_BASE_URL_DEV;
const prodApiUrl = import.meta.env.VITE_API_BASE_URL_PROD;

let baseURL;

if (frontendEnv === 'production') {
  baseURL = prodApiUrl;
} else {
  baseURL = devApiUrl; // Default to development
}

console.log('Frontend Environment:', frontendEnv);
console.log('Selected API Base URL:', baseURL);

const apiClient = axios.create({
  baseURL: baseURL
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Ensure this matches AuthContext
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;