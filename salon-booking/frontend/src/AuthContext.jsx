import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    api('/auth/me')
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const save = (data) => {
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };
  const login = async (email, password) => save(await api('/auth/login', { method: 'POST', body: { email, password } }));
  const register = async (form) => save(await api('/auth/register', { method: 'POST', body: form }));
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loading, login, register, logout }}>{children}</Ctx.Provider>;
}
