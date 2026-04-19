import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(savedUser ? { ...JSON.parse(savedUser), token } : { token });
    }
    setLoading(false);
  }, []);

  const persistUser = (data) => {
    const safeUser = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role || 'user',
      subscription: data.subscription || { plan: 'free', status: 'inactive' },
    };
    localStorage.setItem('user', JSON.stringify(safeUser));
    setUser({ ...safeUser, token: data.token || localStorage.getItem('token') });
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    persistUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    persistUser(data);
    return data;
  };

  const refreshMe = async () => {
    const { data } = await api.get('/auth/me');
    persistUser({ ...data, token: localStorage.getItem('token') });
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore logout API failures for client cleanup
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshMe,
        isAuthenticated: !!user?.token,
        isAdmin: user?.role === 'admin',
        isPremium: user?.subscription?.plan === 'premium' && user?.subscription?.status === 'active',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
