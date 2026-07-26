'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  location: string;
  isLoggedIn: boolean;
  avatar?: string;
}

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (profile: Omit<UserProfile, 'isLoggedIn'>) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('cropcare_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Failed to parse user profile", e);
      localStorage.removeItem('cropcare_user');
    }
    setLoading(false);
  }, []);

  const login = useCallback((profile: Omit<UserProfile, 'isLoggedIn'>) => {
    const newUser = { ...profile, isLoggedIn: true };
    setUser(newUser);
    try {
      localStorage.setItem('cropcare_user', JSON.stringify(newUser));
    } catch (e) {
      console.error("Failed to save user to storage", e);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem('cropcare_user');
    } catch (e) {
      console.error("Failed to remove user from storage", e);
    }
  }, []);

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('cropcare_user', JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save updated user to storage", e);
      }
      return updated;
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
