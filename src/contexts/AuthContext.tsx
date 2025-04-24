
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  email: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  signup: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for user data on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Simple login implementation that stores user data in localStorage
  async function login(email: string, password: string) {
    console.log("Attempting login with:", email);
    
    // For demo purposes, always succeed with valid form data
    const user = { email };
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
    
    return user;
  }

  // Google login simulation
  async function loginWithGoogle() {
    console.log("Attempting Google login");
    
    // Demo implementation
    const user = { email: 'google-user@example.com' };
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
    
    return user;
  }

  // Simple signup implementation
  async function signup(email: string, password: string) {
    console.log("Creating new user with:", email);
    
    // Demo implementation
    const user = { email };
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
    
    return user;
  }

  // Logout functionality
  async function logout() {
    localStorage.removeItem('user');
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    loading,
    login,
    loginWithGoogle,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
