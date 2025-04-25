
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MapPin, Check, X, Clock, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DeliveryPerson {
  name: string;
  phone: string;
}

interface OrderItem {
  id: string;
  customerName: string;
  address: string;
  items: string[];
  total: number;
  status: 'pending' | 'accepted' | 'rejected' | 'delivered';
  deliveryPerson?: DeliveryPerson;
}

export default function Delivery() {
  const { currentUser, isDelivery } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: "order1",
      customerName: "John Smith",
      address: "123 Main St, Anytown, USA",
      items: ["Classic Vanilla (2)", "Double Chocolate (1)"],
      total: 12.47,
      status: 'pending'
    },
    {
      id: "order2",
      customerName: "Jane Doe",
      address: "456 Oak Ave, Springfield",
      items: ["Strawberry Swirl (1)", "Mango Tango (2)"],
      total: 15.98,
      status: 'delivered',
      deliveryPerson: {
        name: "Mike Delivery",
        phone: "555-123-4567"
      }
    }
  ]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [activeTab, setActiveTab] = useState<"current" | "completed">("current");

  // Redirect if not delivery partner
  if (!currentUser || !isDelivery()) {
    return <Navigate to="/login" />;
  }

  const handleAccept = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: 'accepted' as const,
            deliveryPerson: {
              name: currentUser.displayName || "Delivery Partner",
              phone: "555-789-1234"
            }
          } 
        : order
    ));
    const acceptedOrder = orders.find(order => order.id === orderId);
    setSelectedOrder(acceptedOrder || null);
    toast.success("Order accepted! Navigate to customer location.");
  };

  const handleReject = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'rejected' as const } 
        : order
    ));
    setSelectedOrder(null);
    toast.info("Order rejected");
  };

  const handleDeliver = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'delivered' as const } 
        : order
    ));
    toast.success("Order marked as delivered!");
    setSelectedOrder(null);
  };

  const currentOrders = orders.filter(
    order => order.status === 'pending' || order.status === 'accepted'
  );
  
  const completedOrders = orders.filter(
    order => order.status === 'delivered' || order.status === 'rejected'
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
        
        <Tabs defaultValue="current" onValueChange={(value) => setActiveTab(value as "current" | "completed")} className="w-full">
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
                          order.status === 'rejected' ? 'border-red-300 bg-red-50' :
                          order.status === 'delivered' ? 'border-gray-300 bg-gray-50' :
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
                              order.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
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
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-red-500 text-red-500 hover:bg-red-50"
                                onClick={() => handleReject(order.id)}
                              >
                                <X className="w-4 h-4 mr-1" /> Reject
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-green-500 text-green-500 hover:bg-green-50"
                                onClick={() => {
                                  handleAccept(order.id);
                                }}
                              >
                                <Check className="w-4 h-4 mr-1" /> Accept
                              </Button>
                            </>
                          )}
                          
                          {order.status === 'accepted' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-blue-500 text-blue-500 hover:bg-blue-50"
                              onClick={() => handleDeliver(order.id)}
                            >
                              <ArrowRight className="w-4 h-4 mr-1" /> Mark as Delivered
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
                        className={`border rounded-lg p-4 ${
                          order.status === 'delivered' ? 'border-green-300 bg-green-50' :
                          'border-red-300 bg-red-50'
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
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            {activeTab === "current" && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Delivery Map</h2>
                
                {selectedOrder ? (
                  <div>
                    <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center relative">
                      <div className="text-center">
                        <p className="text-gray-600">Interactive map shows route to:</p>
                        <p className="font-medium">{selectedOrder.address}</p>
                        <p className="text-sm text-gray-500 mt-2">Customer: {selectedOrder.customerName}</p>
                      </div>
                    </div>
                    <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                      <h3 className="font-medium">Delivery Instructions</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Follow the route on the map to deliver the order to {selectedOrder.customerName}.
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Your Info (Shown to Customer):</p>
                          <p className="text-sm text-gray-600">Name: {currentUser.displayName || "Delivery Partner"}</p>
                          <p className="text-sm text-gray-600">Phone: 555-789-1234</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-500 text-blue-500 hover:bg-blue-50"
                          onClick={() => handleDeliver(selectedOrder.id)}
                        >
                          <Check className="w-4 h-4 mr-1" /> Complete Delivery
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-600">Accept an order to see delivery route</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Tabs>
      </main>
    </div>
  );
}
