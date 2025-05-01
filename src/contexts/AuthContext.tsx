
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  email: string;
  displayName?: string;
  phone?: string;
  location?: string;
  role: 'user' | 'admin' | 'delivery';
  uid: string; // Add uid property
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  signup: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isDelivery: () => boolean;
  updateProfile: (updatedUser: User) => void;
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

  // Login implementation that handles different user roles
  async function login(email: string, password: string) {
    console.log("Attempting login with:", email);
    
    // Admin login check
    if (email === "bharathkumar21cse@gmail.com" && password === "1234567890") {
      const user = { email, role: 'admin' as const, uid: 'admin-' + Date.now() };
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return user;
    }
    
    // Delivery login check - simple check for any email containing "delivery"
    if (email.includes("delivery") && password.length >= 6) {
      const user = { email, role: 'delivery' as const, uid: 'delivery-' + Date.now() };
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return user;
    }
    
    // Regular user login
    const user = { email, role: 'user' as const, uid: 'user-' + Date.now() };
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
    
    return user;
  }

  // Google login simulation
  async function loginWithGoogle() {
    console.log("Attempting Google login");
    
    // Demo implementation
    const user = { 
      email: 'google-user@example.com', 
      displayName: 'Google User',
      role: 'user' as const,
      uid: 'google-' + Date.now()
    };
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
    
    return user;
  }

  // Simple signup implementation
  async function signup(email: string, password: string) {
    console.log("Creating new user with:", email);
    
    // Demo implementation
    const user = { email, role: 'user' as const, uid: 'user-' + Date.now() };
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
    
    return user;
  }

  // Logout functionality
  async function logout() {
    localStorage.removeItem('user');
    setCurrentUser(null);
  }

  // Update user profile function
  function updateProfile(updatedUser: User) {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  }

  // Role check functions
  function isAdmin() {
    return currentUser?.role === 'admin';
  }

  function isDelivery() {
    return currentUser?.role === 'delivery';
  }

  const value = {
    currentUser,
    loading,
    login,
    loginWithGoogle,
    signup,
    logout,
    isAdmin,
    isDelivery,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
