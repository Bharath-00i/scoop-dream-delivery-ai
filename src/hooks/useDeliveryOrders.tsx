import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc, doc, orderBy, onSnapshot, Timestamp, limit } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { toast } from 'sonner';
import { OrderItem } from '@/types';

export function useDeliveryOrders(userId: string | undefined, autoRefresh: boolean = false) {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to manually fetch orders
  const fetchOrdersManually = async () => {
    setLoading(true);
    try {
      console.log("Manually fetching orders");
      const ordersQuery = query(
        collection(firestore, "orders"),
        orderBy("createdAt", "desc"),
        limit(50)
      );
      
      const snapshot = await getDocs(ordersQuery);
      const fetchedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as OrderItem[];
      
      console.log("Manual fetch complete. Orders found:", fetchedOrders.length);
      if (fetchedOrders.length > 0) {
        console.log("Sample order data:", fetchedOrders[0]);
        setOrders(fetchedOrders);
      } else {
        console.log("No orders found in manual fetch.");
        toast.info("No orders found yet. Check back later or create test orders.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error in manual fetch:", error);
      toast.error("Failed to fetch orders");
      setLoading(false);
    }
  };

  // Function to trigger a refresh
  const refreshOrders = () => {
    console.log("Refresh triggered manually");
    setRefreshTrigger(prev => prev + 1);
  };

  // Only run this effect when the refreshTrigger changes
  useEffect(() => {
    setLoading(true);
    console.log("⭐ Starting orders fetch for delivery dashboard, refresh count:", refreshTrigger);
    
    // Always use the manual fetch method to avoid any listeners
    fetchOrdersManually();
    
    // Return empty cleanup to ensure no lingering listeners
    return () => {};
  }, [refreshTrigger]); // Only depend on refreshTrigger

  const handleAccept = async (orderId: string, currentUser: any) => {
    try {
      // Make sure we have a current user with a uid
      if (!currentUser || !currentUser.uid) {
        toast.error("Authentication error. Please log in again.");
        return;
      }

      const deliveryPersonName = currentUser.displayName || "Delivery Partner";
      const phoneNumber = currentUser.phoneNumber || currentUser.phone || "";

      const deliveryPerson = {
        name: deliveryPersonName,
        phone: phoneNumber
      };
      
      console.log(`Accepting order ${orderId} by user ${currentUser.uid}`);
      
      // Update order in Firestore
      const orderRef = doc(firestore, "orders", orderId);
      await updateDoc(orderRef, {
        status: 'accepted',
        deliveryPerson,
        deliveryPersonId: currentUser.uid
      });
      
      const acceptedOrder = orders.find(order => order.id === orderId);
      setSelectedOrder(acceptedOrder || null);
      toast.success("Order accepted! Navigate to customer location.");
      
      // Refresh orders after accepting
      refreshOrders();
    } catch (error) {
      console.error("Error accepting order:", error);
      toast.error("Failed to accept order. Please try again.");
    }
  };

  const handleDeliver = async (orderId: string) => {
    try {
      console.log(`Marking order ${orderId} as delivered`);
      
      // Update order in Firestore
      const orderRef = doc(firestore, "orders", orderId);
      await updateDoc(orderRef, {
        status: 'delivered'
      });
      
      toast.success("Order marked as delivered!");
      setSelectedOrder(null);
      
      // Refresh orders after delivering
      refreshOrders();
    } catch (error) {
      console.error("Error delivering order:", error);
      toast.error("Failed to mark order as delivered. Please try again.");
    }
  };

  return {
    orders,
    loading,
    selectedOrder,
    setSelectedOrder,
    handleAccept,
    handleDeliver,
    refreshOrders // Expose refresh function
  };
}
