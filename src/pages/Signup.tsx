
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navigation from '@/components/Navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from "sonner";
import { motion } from 'framer-motion';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      setIsLoading(true);
      setError('');
      
      // Simulate account creation (without Firebase)
      console.log('Creating account for:', values.name, values.email);
      
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success toast
      toast("Account created successfully!", {
        description: "You can now log in with your credentials",
        duration: 3000,
        className: "bg-gradient-to-r from-ice-pink to-ice-peach shadow-lg border-2 border-white/20",
        position: "top-center",
      });
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error("Signup error:", err);
      setError('Failed to create an account. Please try again.');
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
