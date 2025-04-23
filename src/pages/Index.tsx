
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import IceCreamCone from '@/components/IceCreamCone';
import DeliveryCheck from '@/components/DeliveryCheck';

const Index = () => {
  const [deliveryStatus, setDeliveryStatus] = useState<'available' | 'unavailable' | 'checking'>('checking');
  const [remainingTime, setRemainingTime] = useState<number>(3 * 60 * 60 + 45 * 60); // 3h 45m in seconds
  const [stockLeft, setStockLeft] = useState<number>(12);
  
  // Format remaining time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-ice-cream">
      <Navigation />
      
      {/* Hero Section with 3D Ice Cream */}
      <section className="relative pt-10 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="bg-strawberry text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    Today's Special
                  </div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <span className="inline-block w-2 h-2 bg-strawberry rounded-full mr-1"></span>
                    Offer ends in {formatTime(remainingTime)}
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground leading-tight">
                  <span className="text-strawberry">Handcrafted</span> Ice Cream <br className="hidden md:block" />
                  Made with <span className="text-mint">Love</span>
                </h1>
                
                <p className="text-lg text-gray-600 max-w-lg">
                  Indulge in our premium, artisanal ice cream made from locally sourced ingredients. 
                  Each scoop is a perfect blend of flavor, texture, and sweetness.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link to="/menu">
                    <Button className="bg-strawberry hover:bg-strawberry/90 text-white text-lg px-8 py-6">
                      See Our Menu
                    </Button>
                  </Link>
                  {deliveryStatus === 'available' && (
                    <Link to="/checkout">
                      <Button variant="outline" className="text-lg px-8 py-6 border-2">
                        Order Now
                      </Button>
                    </Link>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-mint">200+</span> happy customers this week
                  </div>
                </div>
                
                <div className="mt-4 flex items-center text-sm text-orange-600 font-medium">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"></path>
                    <path d="M10 5a1 1 0 011 1v3.586l2.707 2.707a1 1 0 11-1.414 1.414l-3-3A1 1 0 019 10V6a1 1 0 011-1z"></path>
                  </svg>
                  <span>Only {stockLeft} cones left today!</span>
                </div>
              </div>
            </motion.div>
            
            {/* Right 3D Ice Cream Display */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[500px] flex items-center justify-center"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-strawberry/20 rounded-full filter blur-3xl animate-blob"></div>
                <div className="w-72 h-72 bg-mint/20 rounded-full filter blur-3xl animate-blob"></div>
              </div>
              
              <IceCreamCone />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Delivery Check Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-4">Find out if we deliver to your area</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We deliver our delicious ice cream within a 5 km radius of our shop. 
                Check if your location qualifies for delivery!
              </p>
              
              <div className="bg-ice-pink/20 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">Did you know?</h3>
                <p>
                  Our ice cream is made fresh daily in small batches,
                  ensuring you get the best quality and taste with every scoop.
                </p>
              </div>
            </div>
            
            <DeliveryCheck onStatusChange={setDeliveryStatus} />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 md:px-8 bg-foreground text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-2xl font-heading font-bold text-strawberry">Scoops</span>
                <span className="text-2xl font-heading font-bold ml-1 text-mint">Dream</span>
              </div>
              <p className="text-gray-300">
                Artisanal ice cream made with love and the finest ingredients.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/menu" className="hover:text-strawberry">Our Menu</Link></li>
                <li><Link to="/about" className="hover:text-strawberry">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-strawberry">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <address className="not-italic text-gray-300 space-y-2">
                <p>123 Ice Cream Lane</p>
                <p>Dessert City, DC 12345</p>
                <p>Phone: (123) 456-7890</p>
                <p>Email: hello@scoopsdream.com</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Scoops Dream. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
