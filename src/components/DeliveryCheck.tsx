
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { getCurrentLocation, isWithinDeliveryRadius, calculateDistance, SHOP_LOCATION, formatDistance, MAX_DELIVERY_RADIUS } from '@/lib/location';

interface DeliveryCheckProps {
  onStatusChange?: (status: 'available' | 'unavailable' | 'checking') => void;
}

export default function DeliveryCheck({ onStatusChange }: DeliveryCheckProps) {
  const [status, setStatus] = useState<'checking' | 'available' | 'unavailable' | 'permission_denied' | 'idle'>('idle');
  const [distance, setDistance] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Handle status changes
  useEffect(() => {
    if (onStatusChange && (status === 'available' || status === 'unavailable')) {
      onStatusChange(status);
    } else if (onStatusChange && (status === 'checking' || status === 'idle' || status === 'permission_denied')) {
      onStatusChange('checking');
    }
  }, [status, onStatusChange]);

  // Check delivery availability based on user's location
  const checkDeliveryAvailability = async () => {
    setIsChecking(true);
    setStatus('checking');
    
    try {
      const location = await getCurrentLocation();
      
      // Calculate distance between user and shop
      const dist = calculateDistance(
        location.lat,
        location.lng,
        SHOP_LOCATION.lat,
        SHOP_LOCATION.lng
      );
      
      setDistance(dist);
      
      // Check if within delivery radius
      if (isWithinDeliveryRadius(location.lat, location.lng)) {
        setStatus('available');
      } else {
        setStatus('unavailable');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setStatus('permission_denied');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-heading font-semibold mb-4">Delivery Availability</h3>
      
      {status === 'idle' && (
        <div>
          <p className="mb-4 text-muted-foreground">
            Check if we can deliver ice cream to your location.
            Our delivery is available within {MAX_DELIVERY_RADIUS} km of our shop.
          </p>
          <Button 
            onClick={checkDeliveryAvailability}
            className="bg-strawberry hover:bg-strawberry/90 text-white"
          >
            Check My Location
          </Button>
        </div>
      )}
      
      {status === 'checking' && (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-strawberry"></div>
          <p className="mt-4">Checking your location...</p>
        </div>
      )}
      
      {status === 'permission_denied' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-muted p-4 rounded-xl">
            <p className="text-lg mb-2">Location Access Required</p>
            <p className="text-sm text-muted-foreground mb-4">
              Please enable location services in your browser to check if delivery is available in your area.
            </p>
            <Button 
              onClick={checkDeliveryAvailability} 
              variant="secondary"
            >
              Try Again
            </Button>
          </div>
        </motion.div>
      )}
      
      {status === 'available' && distance !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-ice-green p-6 rounded-xl mb-4">
            <div className="text-4xl mb-2">🎉</div>
            <h4 className="text-lg font-semibold text-green-700 mb-2">Delivery Available!</h4>
            <p>You are {formatDistance(distance)} away from our shop.</p>
          </div>
          <Button className="bg-strawberry hover:bg-strawberry/90 text-white w-full">
            Order Now
          </Button>
        </motion.div>
      )}
      
      {status === 'unavailable' && distance !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-ice-pink p-6 rounded-xl mb-4">
            <div className="text-4xl mb-2">😢</div>
            <h4 className="text-lg font-semibold text-red-700 mb-2">Sorry, No Delivery</h4>
            <p>You are {formatDistance(distance)} away from our shop.</p>
            <p className="mt-2 text-sm">We only deliver within {MAX_DELIVERY_RADIUS} km.</p>
          </div>
          <Button variant="outline" className="w-full">
            Find Stores
          </Button>
        </motion.div>
      )}
      
      {(status === 'available' || status === 'unavailable') && (
        <div className="mt-4 text-center">
          <button 
            onClick={() => {
              setStatus('idle');
              setDistance(null);
            }}
            className="text-sm text-muted-foreground underline"
          >
            Check another location
          </button>
        </div>
      )}
    </div>
  );
}
