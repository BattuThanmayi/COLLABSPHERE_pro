import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // Verify token and fetch user data if needed
      verifyToken(token);
    } else {
      localStorage.removeItem('token');
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async (tokenValue) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${tokenValue}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        console.error('Token verification failed');
      }
    } catch (err) {
      console.error('Token verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, authToken) => {
    setUser(userData);
    localStorage.setItem('token', authToken);
    setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
