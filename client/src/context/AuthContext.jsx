import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api'; 

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // The api service will automatically add the token to headers
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me'); // Use api instead of axios directly
      setUser(res.data);
    } catch (error) {
      localStorage.removeItem('token');
      // The api interceptor will handle redirect on 401 errors
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    try {
      setError('');
      const res = await api.post('/auth/register', formData); // Use api service
      const { token, ...userData } = res.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const login = async (formData) => {
    try {
      setError('');
      const res = await api.post('/auth/login', formData); // Use api service
      const { token, ...userData } = res.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};