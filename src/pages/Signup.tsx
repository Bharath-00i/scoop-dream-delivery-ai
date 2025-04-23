
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from "sonner";
import { motion } from 'framer-motion';
import { FirebaseError } from 'firebase/app';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      setIsLoading(true);
      setError('');
      setDebugInfo('Attempting signup...');
      
      await signup(values.email, values.password);
      
      setDebugInfo('Signup successful, showing toast...');
      // Show 3D toast notification
      toast("Account created successfully!", {
        description: "You can now log in with your credentials",
        duration: 3000,
        className: "bg-gradient-to-r from-ice-pink to-ice-peach shadow-lg border-2 border-white/20",
        position: "top-center",
        style: {
          transform: "translateZ(50px)", 
          perspective: "1000px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          borderRadius: "1rem"
        },
      });
      
      // Delay navigation to allow toast to be seen
      setDebugInfo('Preparing to navigate to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error("Signup error:", err);
      
      if (err instanceof FirebaseError) {
        // Handle specific Firebase errors
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('This email is already in use. Try logging in instead.');
            break;
          case 'auth/invalid-email':
            setError('Invalid email address format.');
            break;
          case 'auth/weak-password':
            setError('Password is too weak. Please use at least 6 characters.');
            break;
          case 'auth/network-request-failed':
            setError('Network error. Please check your connection and try again.');
            break;
          case 'auth/api-key-not-valid':
          case 'auth/invalid-api-key':
            setError('Authentication error: Invalid API configuration. Please contact support.');
            setDebugInfo('API Key validation failed. The Firebase project may not be properly set up.');
            break;
          default:
            setError(`Failed to create an account: ${err.message || err.code}`);
        }
      } else {
        setError('Failed to create an account. Please try again.');
        if (err instanceof Error) {
          setDebugInfo(`Error details: ${err.message}`);
        }
      }
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      console.error("Google login error:", err);
      if (err instanceof FirebaseError) {
        setError(`Failed to sign in with Google: ${err.message || err.code}`);
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ice-cream">
      <Navigation />
      <div className="pt-10 pb-20 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground">Create Account</h1>
            <p className="text-muted-foreground mt-2">Join our ice cream community</p>
          </div>

          {error && (
            <motion.div 
              className="bg-ice-pink p-3 rounded-lg mb-6 text-red-600 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          {debugInfo && process.env.NODE_ENV !== 'production' && (
            <div className="bg-blue-50 p-2 rounded-lg mb-4 text-blue-600 text-xs">
              <p>Debug info: {debugInfo}</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-strawberry hover:bg-strawberry/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign up with Google
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-strawberry hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
