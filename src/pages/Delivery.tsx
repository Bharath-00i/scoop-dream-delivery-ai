
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SHOP_LOCATION } from '@/lib/location';
import DeliveryMap from '@/components/DeliveryMap';
import OrderList from '@/components/delivery/OrderList';
import { useDeliveryOrders } from '@/hooks/useDeliveryOrders';
import TestOrderGenerator from '@/components/delivery/TestOrderGenerator';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

export default function Delivery() {
  const { currentUser, isDelivery } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const [showTestTools, setShowTestTools] = useState(false);
  
  // Handle authentication check as a state effect
  useEffect(() => {
    setAuthChecked(true);
    
    // Immediately refresh orders when page loads
    if (refreshOrders) {
      console.log("Initial order refresh on delivery page mount");
      refreshOrders();
    }
  }, []);

  // We don't pass userId to useDeliveryOrders anymore since we want ALL orders
  const {
    orders,
    loading,
    selectedOrder,
    setSelectedOrder,
    handleAccept,
    handleDeliver,
    refreshOrders
  } = useDeliveryOrders(undefined);

  console.log("Delivery page - Total orders:", orders.length);

  // Accept order wrapper function
  const acceptOrder = (orderId: string) => {
    handleAccept(orderId, currentUser);
  };

  // Move authentication check here, after all hooks are used
  if (authChecked && (!currentUser || !isDelivery())) {
    return <Navigate to="/login" />;
  }

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
              <OrderList
                orders={orders}
                loading={loading}
                onAccept={acceptOrder}
                onDeliver={handleDeliver}
                type="current"
                onRefreshOrders={refreshOrders}
              />
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              <OrderList
                orders={orders}
                loading={loading}
                onAccept={acceptOrder}
                onDeliver={handleDeliver}
                type="completed"
                onRefreshOrders={refreshOrders}
              />
            </TabsContent>

            {/* Test Order Generator (toggle button) */}
            <div className="lg:col-span-2 flex justify-center mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowTestTools(!showTestTools)}
                className="flex gap-2 items-center"
              >
                <Package size={16} />
                {showTestTools ? "Hide Test Tools" : "Show Test Tools"}
              </Button>
            </div>
            
            {/* Test Order Generator Component */}
            {showTestTools && (
              <div className="lg:col-span-2 mt-2">
                <TestOrderGenerator onOrderCreated={refreshOrders} />
              </div>
            )}
            
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
