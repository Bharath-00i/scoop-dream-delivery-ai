import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-2xl font-heading font-bold text-strawberry">Scoops</span>
              <span className="text-2xl font-heading font-bold ml-1 text-mint">Dream</span>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className="group relative"
              >
                <span className={`text-lg font-medium transition-colors ${
                  location.pathname === item.path ? 'text-strawberry' : 'text-foreground hover:text-strawberry'
                }`}>
                  {item.name}
                </span>
                {location.pathname === item.path && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-strawberry"
                    layoutId="navbar-indicator"
                  />
                )}
              </Link>
            ))}

            <div className="flex items-center space-x-4">
              <Link to="/wishlist" className="relative">
                <Heart 
                  className="text-gray-600 hover:text-strawberry transition-colors"
                  fill={wishlistItems.length > 0 ? 'currentColor' : 'none'}
                />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-strawberry text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative">
                <ShoppingCart 
                  className="text-gray-600 hover:text-strawberry transition-colors"
                />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-strawberry text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link to="/account">
                  <Button variant="ghost" className="text-foreground">
                    My Account
                  </Button>
                </Link>
                <Button 
                  variant="outline"
                  onClick={() => logout()}
                >
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" className="text-foreground">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-strawberry hover:bg-strawberry/90 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden flex items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden bg-white pt-20"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-6 px-6 py-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={item.path}
                    className={`text-xl font-medium block py-2 ${
                      location.pathname === item.path ? 'text-strawberry' : 'text-foreground'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <div className="pt-6 border-t border-gray-100">
                {currentUser ? (
                  <div className="flex flex-col space-y-4">
                    <Link to="/account" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-lg">
                        My Account
                      </Button>
                    </Link>
                    <Button 
                      variant="outline"
                      className="w-full justify-start text-lg"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Log Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-lg">
                        Log In
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-strawberry hover:bg-strawberry/90 text-white text-lg">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-20" />
    </>
  );
};

export default Navigation;
