import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Mock Firebase types for development
interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
}

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithPhone: (phoneNumber: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
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
  
  // Mock user for development
  const mockUser: User = {
    uid: 'mock-user-123',
    email: 'user@example.com',
    displayName: 'Mock User',
    phoneNumber: '+91 9876543210'
  };

  useEffect(() => {
    // Mock auth state - start as logged out, but ready
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - always succeeds
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    setUser(mockUser);
  };

  const signup = async (email: string, password: string) => {
    // Mock signup - always succeeds
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    setUser(mockUser);
  };

  const loginWithGoogle = async () => {
    // Mock Google login - always succeeds
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
    setUser(mockUser);
  };

  const loginWithPhone = async (phoneNumber: string) => {
    // Mock phone login - always succeeds
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network delay
    setUser(mockUser);
  };

  const logout = async () => {
    // Mock logout - always succeeds
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    loginWithGoogle,
    loginWithPhone,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};