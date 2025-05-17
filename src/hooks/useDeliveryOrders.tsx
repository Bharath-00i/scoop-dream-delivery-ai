
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc, doc, orderBy, onSnapshot, Timestamp, limit } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { toast } from 'sonner';
import { OrderItem } from '@/types';

export function useDeliveryOrders(userId: string | undefined) {
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

  useEffect(() => {
    setLoading(true);
    console.log("⭐ Starting orders fetch for delivery dashboard, refresh count:", refreshTrigger);
    
    try {
      // Set up real-time listener for ALL orders in the system
      const ordersQuery = query(
        collection(firestore, "orders"),
        orderBy("createdAt", "desc")
      );
      
      const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
        console.log("🔄 Snapshot received, documents count:", snapshot.docs.length);
        
        const fetchedOrders = snapshot.docs.map(doc => {
          const data = doc.data();
          // Convert Firestore timestamp to JS Date if needed
          const createdAt = data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate() 
            : data.createdAt;
            
          return {
            id: doc.id,
            ...data,
            createdAt
          };
        }) as OrderItem[];
        
        console.log("📊 Total orders fetched:", fetchedOrders.length);
        
        if (fetchedOrders.length === 0) {
          console.log("⚠️ No orders found in the database");
          // No longer setting a timeout here, user can manually refresh
        } else {
          console.log("✅ Orders found! First order:", fetchedOrders[0]);
          
          // Debug order statuses
          const pendingCount = fetchedOrders.filter(o => o.status === 'pending').length;
          const acceptedCount = fetchedOrders.filter(o => o.status === 'accepted').length;
          const deliveredCount = fetchedOrders.filter(o => o.status === 'delivered').length;
          
          console.log(`📊 Order status counts - Pending: ${pendingCount}, Accepted: ${acceptedCount}, Delivered: ${deliveredCount}`);
        }
        
        // Show ALL orders in the dashboard regardless of status
        setOrders(fetchedOrders);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
        setLoading(false);
        // Try manual fetch as fallback
        fetchOrdersManually();
      });
      
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error("Error setting up listener:", error);
      toast.error("Failed to set up order tracking");
      setLoading(false);
      // Try manual fetch if listener setup fails
      fetchOrdersManually();
    }
  }, [refreshTrigger]); // Added refreshTrigger as a dependency

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
