
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signOut,
  AuthError
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';

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
    // Firebase observer for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Login with email and password
  async function login(email: string, password: string) {
    try {
      console.log("Attempting login with:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful for:", userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Login with Google
  async function loginWithGoogle() {
    try {
      console.log("Attempting Google login");
      const userCredential = await signInWithPopup(auth, googleProvider);
      console.log("Google login successful for:", userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error("Google login error details:", error);
      throw error;
    }
  }

  // Sign up with email and password
  async function signup(email: string, password: string) {
    try {
      console.log("Attempting to create user with:", { email, passwordLength: password.length });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created successfully:", userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error("Error in signup function details:", error);
      
      // Enhanced error logging for debugging
      if (error instanceof FirebaseError) {
        console.error("Firebase error code:", error.code);
        console.error("Firebase error message:", error.message);
        
        if (error.code === 'auth/api-key-not-valid') {
          console.error("Firebase API key is invalid. Please check your firebase configuration.");
        }
      }
      
      throw error; // Re-throw to handle in the component
    }
  }

  // Logout
  async function logout() {
    await signOut(auth);
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
