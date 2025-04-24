
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-mint-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <motion.h1 
          className="text-4xl md:text-5xl font-heading font-bold text-center mb-8 text-strawberry"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Wishlist
        </motion.h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center">
            <p className="text-xl mb-4">Your wishlist is empty</p>
            <Button asChild>
              <Link to="/menu">Browse Menu</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistItems.map((item, index) => (
              <motion.div 
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-gray-400 hover:text-strawberry transition-colors"
                      >
                        <Heart className="fill-strawberry text-strawberry" />
                      </button>
                      <span className="font-medium text-strawberry">${item.price}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <Button 
                    onClick={() => {
                      addToCart(item);
                      removeFromWishlist(item.id);
                    }}
                    className="w-full"
                  >
                    Move to Cart
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;

