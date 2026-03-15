import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, setCurrentUser } from '../utils/auth';
import type { AuthUser } from '../utils/auth';

type AuthContextValue = {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const current = getCurrentUser();
    if (current) {
      setUser(current);
    }
  }, []);

  const login = (nextUser: AuthUser) => {
    setCurrentUser(nextUser);
    setUser(nextUser);
  };

  const logout = () => {
    setCurrentUser(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
