import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would call an authentication API
    // For demo purposes, we're mocking successful authentication
    if (email && password) {
      const mockUser = {
        id: 'user-123',
        name: 'Demo User',
        email: email,
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return;
    }
    
    throw new Error('Invalid credentials');
  };

  const register = async (email: string, password: string, name: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would call a registration API
    // For demo purposes, we're mocking successful registration
    if (email && password && name) {
      const mockUser = {
        id: `user-${Date.now()}`,
        name: name,
        email: email,
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return;
    }
    
    throw new Error('Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};