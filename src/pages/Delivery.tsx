
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MapPin, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SHOP_LOCATION } from '@/lib/location';
import DeliveryMap from '@/components/DeliveryMap';

interface OrderItem {
  id: string;
  customerName: string;
  address: string;
  items: string[];
  total: number;
  status: 'pending' | 'accepted' | 'delivered';
  customerLocation?: {
    lat: number;
    lng: number;
  };
  deliveryPerson?: {
    name: string;
    phone: string;
  };
}

export default function Delivery() {
  const { currentUser, isDelivery } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  if (!currentUser || !isDelivery()) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const fetchOrders = () => {
      setOrders([]);
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleAccept = (orderId: string) => {
    const deliveryPersonName = currentUser.displayName || "Delivery Partner";
    const phoneNumber = (currentUser as any).phoneNumber || 
                       (currentUser as any).phone || 
                       "";

    const deliveryPerson = {
      name: deliveryPersonName,
      phone: phoneNumber
    };

    setOrders(orders.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: 'accepted',
            deliveryPerson
          } 
        : order
    ));
    
    const acceptedOrder = orders.find(order => order.id === orderId);
    setSelectedOrder(acceptedOrder || null);
    toast.success("Order accepted! Navigate to customer location.");
  };

  const handleDeliver = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'delivered' } 
        : order
    ));
    toast.success("Order marked as delivered!");
    setSelectedOrder(null);
  };

  const currentOrders = orders.filter(
    order => order.status === 'pending' || order.status === 'accepted'
  );
  
  const completedOrders = orders.filter(
    order => order.status === 'delivered'
  );

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
          Delivery Dashboard
        </motion.h1>
        
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="current">Current Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed Orders</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TabsContent value="current" className="mt-0">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Current Orders</h2>
                
                {currentOrders.length === 0 ? (
                  <p className="text-center py-10 text-gray-500">No orders available at the moment</p>
                ) : (
                  <div className="space-y-4">
                    {currentOrders.map((order) => (
                      <div 
                        key={order.id} 
                        className={`border rounded-lg p-4 ${
                          order.status === 'accepted' ? 'border-green-300 bg-green-50' : 
                          'border-blue-300 bg-blue-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{order.customerName}</h3>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              {order.address}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${order.total.toFixed(2)}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm font-medium">Items:</p>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {order.items.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mt-4 flex justify-end space-x-2">
                          {order.status === 'pending' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-green-500 text-green-500 hover:bg-green-50"
                              onClick={() => handleAccept(order.id)}
                            >
                              <Check className="w-4 h-4 mr-1" /> Accept
                            </Button>
                          )}
                          
                          {order.status === 'accepted' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-blue-500 text-blue-500 hover:bg-blue-50"
                              onClick={() => handleDeliver(order.id)}
                            >
                              Mark as Delivered
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Completed Orders</h2>
                
                {completedOrders.length === 0 ? (
                  <p className="text-center py-10 text-gray-500">No completed orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {completedOrders.map((order) => (
                      <div 
                        key={order.id} 
                        className="border border-green-300 bg-green-50 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{order.customerName}</h3>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              {order.address}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${order.total.toFixed(2)}</p>
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                              Delivered
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm font-medium">Items:</p>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {order.items.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            {selectedOrder && (
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">Delivery Map</h2>
                  <div className="h-[400px] rounded-lg overflow-hidden">
                    <DeliveryMap 
                      shopLocation={SHOP_LOCATION}
                      customerLocation={selectedOrder.customerLocation}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </main>
    </div>
  );
}
