import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, UserRole } from '@/types/auth';

// Dummy users for MVP
const DUMMY_USERS: Array<User & { password: string }> = [
  {
    id: '1',
    username: 'worker1',
    email: 'worker1@company.com',
    password: 'password',
    role: 'worker',
    fullName: 'John Smith',
    department: 'Quality Control',
    avatar: '/placeholder.svg'
  },
  {
    id: '2',
    username: 'supervisor1',
    email: 'supervisor1@company.com',
    password: 'password',
    role: 'supervisor',
    fullName: 'Sarah Johnson',
    department: 'Quality Assurance',
    avatar: '/placeholder.svg'
  },
  {
    id: '3',
    username: 'admin1',
    email: 'admin1@company.com',
    password: 'password',
    role: 'admin',
    fullName: 'Michael Chen',
    department: 'IT Administration',
    avatar: '/placeholder.svg'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('icms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = DUMMY_USERS.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('icms_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('icms_user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};