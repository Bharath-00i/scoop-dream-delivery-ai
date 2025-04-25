import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { Toaster } from "sonner"; 
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import Admin from "./pages/Admin";
import Delivery from "./pages/Delivery";

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  children: React.ReactNode;
  roleRequired?: 'admin' | 'delivery';
}

const ProtectedRoute = ({ children, roleRequired }: ProtectedRouteProps) => {
  const { currentUser, loading, isAdmin, isDelivery } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Check roles if required
  if (roleRequired) {
    if (roleRequired === 'admin' && !isAdmin()) {
      return <Navigate to="/" />;
    }
    if (roleRequired === 'delivery' && !isDelivery()) {
      return <Navigate to="/" />;
    }
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/menu" element={<Menu />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/delivery" 
                  element={
                    <ProtectedRoute roleRequired="delivery">
                      <Delivery />
                    </ProtectedRoute>
                  } 
                />
                {/* Redirect all other routes to menu for delivery users */}
                <Route path="*" element={<Navigate to="/menu" />} />
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
