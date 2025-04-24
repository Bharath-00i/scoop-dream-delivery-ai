import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Navigation from "@/components/Navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

interface FlavorItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: number;
  category: "regular" | "premium" | "seasonal";
}

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const flavors: FlavorItem[] = [
    {
      id: "vanilla",
      name: "Classic Vanilla",
      description: "Smooth and creamy vanilla made with real Madagascar vanilla beans",
      price: 3.99,
      image: "/placeholder.svg",
      available: 24,
      category: "regular"
    },
    {
      id: "chocolate",
      name: "Double Chocolate",
      description: "Rich chocolate ice cream with chocolate chips throughout",
      price: 4.49,
      image: "/placeholder.svg",
      available: 18,
      category: "regular"
    },
    {
      id: "strawberry",
      name: "Fresh Strawberry",
      description: "Made with local seasonal strawberries and a hint of lemon",
      price: 4.49,
      image: "/placeholder.svg",
      available: 12,
      category: "regular"
    },
    {
      id: "mint-choc",
      name: "Mint Chocolate Chip",
      description: "Cool mint ice cream loaded with chocolate chips",
      price: 4.99,
      image: "/placeholder.svg",
      available: 15,
      category: "premium"
    },
    {
      id: "cookie-dough",
      name: "Cookie Dough",
      description: "Vanilla ice cream with chunks of chocolate chip cookie dough",
      price: 5.49,
      image: "/placeholder.svg",
      available: 8,
      category: "premium"
    },
    {
      id: "mango-sorbet",
      name: "Mango Tango Sorbet",
      description: "Refreshing dairy-free mango sorbet with a hint of lime",
      price: 4.99,
      image: "/placeholder.svg",
      available: 10,
      category: "seasonal"
    }
  ];
  
  const filteredFlavors = selectedCategory === "all" 
    ? flavors 
    : flavors.filter(flavor => flavor.category === selectedCategory);
  
  const categories = [
    { id: "all", label: "All Flavors" },
    { id: "regular", label: "Regular" },
    { id: "premium", label: "Premium" },
    { id: "seasonal", label: "Seasonal" }
  ];

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
          Our Menu
        </motion.h1>
        
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id 
                  ? 'bg-strawberry text-white' 
                  : 'bg-white text-gray-700 hover:bg-strawberry/10'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFlavors.map((flavor, index) => (
            <motion.div 
              key={flavor.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <AspectRatio ratio={16/9}>
                <div className="bg-gray-100 h-full w-full flex items-center justify-center">
                  <span className="text-gray-400">Image Placeholder</span>
                </div>
              </AspectRatio>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{flavor.name}</h2>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => isInWishlist(flavor.id) 
                        ? removeFromWishlist(flavor.id) 
                        : addToWishlist(flavor)
                      }
                      className="text-gray-400 hover:text-strawberry transition-colors"
                    >
                      <Heart 
                        className={isInWishlist(flavor.id) ? "fill-strawberry text-strawberry" : ""} 
                      />
                    </button>
                    <span className="font-medium text-strawberry">${flavor.price}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{flavor.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {flavor.available <= 5 ? (
                      <span className="text-red-500 font-medium">Only {flavor.available} left!</span>
                    ) : (
                      `${flavor.available} available`
                    )}
                  </span>
                  <button 
                    onClick={() => addToCart(flavor)}
                    className="px-4 py-2 bg-strawberry text-white rounded-lg hover:bg-strawberry/90 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Menu;
