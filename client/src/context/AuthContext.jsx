import { createContext, useCallback, useContext, useState } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);

const STORAGE_KEY = 'noteUser';

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  const saveUser = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const data = await api('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    saveUser(data);
  };

  const register = async (name, email, password) => {
    const data = await api('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
    saveUser(data);
  };

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
