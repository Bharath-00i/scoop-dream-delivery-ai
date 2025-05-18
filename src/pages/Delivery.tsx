
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
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from "sonner";

export default function Delivery() {
  const { currentUser, isDelivery } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  
  // Handle authentication check as a state effect
  useEffect(() => {
    setAuthChecked(true);
  }, []);

  const {
    orders,
    loading,
    selectedOrder,
    handleAccept,
    handleDeliver,
    handleShowRoute,
    refreshOrders
  } = useDeliveryOrders();

  // Handle manual refresh with visual feedback
  const handleManualRefresh = () => {
    toast.info("Refreshing orders...");
    refreshOrders();
  };

  // Move authentication check here
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
        
        <div className="mb-6 flex justify-center">
          <Button
            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600"
            onClick={handleManualRefresh}
          >
            <RefreshCw className="h-4 w-4" /> Refresh Orders
          </Button>
        </div>
        
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
                onAccept={(orderId) => handleAccept(orderId, currentUser)}
                onDeliver={handleDeliver}
                onShowRoute={handleShowRoute}
                type="current"
              />
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              <OrderList
                orders={orders}
                loading={loading}
                onAccept={(orderId) => handleAccept(orderId, currentUser)}
                onDeliver={handleDeliver}
                onShowRoute={handleShowRoute}
                type="completed"
              />
            </TabsContent>
            
            {selectedOrder && (
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">
                    {selectedOrder.status === 'accepted' ? 'Delivery Route' : 'Customer Location'}
                  </h2>
                  <div className="h-[400px] rounded-lg overflow-hidden">
                    <DeliveryMap 
                      shopLocation={SHOP_LOCATION}
                      customerLocation={selectedOrder.customerLocation}
                      showRoute={selectedOrder.status === 'accepted'}
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
