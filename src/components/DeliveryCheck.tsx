import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  getCurrentLocation, 
  isWithinDeliveryRadius, 
  calculateDistance, 
  SHOP_LOCATION, 
  formatDistance, 
  MAX_DELIVERY_RADIUS 
} from '@/lib/location';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from '@/components/ui/drawer';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface DeliveryCheckProps {
  onStatusChange?: (status: 'available' | 'unavailable' | 'checking') => void;
}

const locationFormSchema = z.object({
  street: z.string().min(3, "Please enter a valid street address"),
  city: z.string().min(2, "Please enter a valid city"),
  pincode: z.string().min(6, "Please enter a valid pincode").max(10)
});

type LocationFormValues = z.infer<typeof locationFormSchema>;

export default function DeliveryCheck({ onStatusChange }: DeliveryCheckProps) {
  const [status, setStatus] = useState<'checking' | 'available' | 'unavailable' | 'permission_denied' | 'idle'>('idle');
  const [distance, setDistance] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      street: "",
      city: "Avinashi, Tiruppur",
      pincode: ""
    }
  });

  useEffect(() => {
    if (onStatusChange && (status === 'available' || status === 'unavailable')) {
      onStatusChange(status);
    } else if (onStatusChange && (status === 'checking' || status === 'idle' || status === 'permission_denied')) {
      onStatusChange('checking');
    }
  }, [status, onStatusChange]);

  const checkDeliveryAvailability = async () => {
    setIsChecking(true);
    setStatus('checking');
    
    try {
      const location = await getCurrentLocation();
      
      const dist = calculateDistance(
        location.lat,
        location.lng,
        SHOP_LOCATION.lat,
        SHOP_LOCATION.lng
      );
      
      setDistance(dist);
      
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

  const handleManualLocationSubmit = (data: LocationFormValues) => {
    setIsChecking(true);
    setStatus('checking');
    
    setTimeout(() => {
      const randomDistance = Math.random() * 80;
      setDistance(randomDistance);
      
      if (randomDistance <= MAX_DELIVERY_RADIUS) {
        setStatus('available');
      } else {
        setStatus('unavailable');
      }
      
      setIsChecking(false);
      setOpen(false);
      
      toast(`Location checked: ${data.street}, ${data.city}, ${data.pincode}`, {
        position: "top-center",
      });
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-heading font-semibold mb-4">Delivery Availability</h3>
      
      {status === 'idle' && (
        <div>
          <p className="mb-4 text-muted-foreground">
            Check if we can deliver ice cream to your location.
            Our delivery is available within {MAX_DELIVERY_RADIUS} km of our shop in Avinashi.
          </p>
          <Button 
            onClick={checkDeliveryAvailability}
            className="bg-chocolate hover:bg-chocolate/90 text-white"
          >
            Check My Location
          </Button>
        </div>
      )}
      
      {status === 'checking' && (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chocolate"></div>
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
              Please enable location services or enter your address manually to check delivery availability.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={checkDeliveryAvailability} 
                variant="secondary"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => setOpen(true)}
                variant="outline"
              >
                Enter Address Manually
              </Button>
            </div>
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
          <Button className="bg-chocolate hover:bg-chocolate/90 text-white w-full" asChild>
            <Link to="/menu">Order Now</Link>
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
            <p className="mt-2 text-sm">We only deliver within {MAX_DELIVERY_RADIUS} km of Avinashi.</p>
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
              setOpen(true);
            }}
            className="text-sm text-muted-foreground underline"
          >
            Check another location
          </button>
        </div>
      )}

      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="bg-white">
            <DrawerHeader>
              <DrawerTitle>Enter Your Location</DrawerTitle>
              <DrawerDescription>
                Check if we can deliver to your address
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleManualLocationSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Avinashi, Tiruppur" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode</FormLabel>
                        <FormControl>
                          <Input placeholder="641654" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DrawerFooter>
                    <Button 
                      type="submit" 
                      className="bg-chocolate hover:bg-chocolate/90 text-white w-full"
                    >
                      Check Delivery Availability
                    </Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </form>
              </Form>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Enter Your Location</DialogTitle>
              <DialogDescription>
                Check if we can deliver to your address
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleManualLocationSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Avinashi, Tiruppur" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input placeholder="641654" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="bg-chocolate hover:bg-chocolate/90 text-white"
                  >
                    Check Delivery Availability
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
