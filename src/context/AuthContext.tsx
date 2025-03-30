
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'voter' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  voterId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in already
  useEffect(() => {
    const storedUser = localStorage.getItem('electraUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Simulated login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // For demo: simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo users
      if (email === 'admin@example.com' && password === 'password') {
        const adminUser = {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin' as UserRole
        };
        setUser(adminUser);
        localStorage.setItem('electraUser', JSON.stringify(adminUser));
      } else if (email === 'voter@example.com' && password === 'password') {
        const voterUser = {
          id: '2',
          name: 'Voter User',
          email: 'voter@example.com',
          role: 'voter' as UserRole,
          voterId: 'V12345'
        };
        setUser(voterUser);
        localStorage.setItem('electraUser', JSON.stringify(voterUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Simulated register function
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      // For demo: simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
        ...(role === 'voter' && { voterId: `V${Math.floor(10000 + Math.random() * 90000)}` })
      };
      
      setUser(newUser);
      localStorage.setItem('electraUser', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('electraUser');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout, 
      register,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
