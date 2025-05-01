
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc, doc, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { toast } from 'sonner';
import { OrderItem } from '@/types';

export function useDeliveryOrders(userId: string | undefined) {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure we have a valid user ID before proceeding
    if (!userId) {
      console.log("No valid user ID found");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    console.log("Fetching orders for delivery person ID:", userId);
    
    // Create query reference for all pending orders, regardless of source
    // Removed any filters that might be limiting which orders are displayed
    const pendingOrdersQuery = query(
      collection(firestore, "orders"), 
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );
    
    // Create query for accepted orders by this delivery person
    const acceptedOrdersQuery = query(
      collection(firestore, "orders"),
      where("status", "==", "accepted"),
      where("deliveryPersonId", "==", userId)
    );
    
    // Set up real-time listeners for both queries
    const pendingUnsubscribe = onSnapshot(pendingOrdersQuery, (snapshot) => {
      const pendingOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as OrderItem[];
      
      console.log("Pending orders updated:", pendingOrders);
      
      // Update orders state by combining with accepted orders
      setOrders(currentOrders => {
        const acceptedOrders = currentOrders.filter(order => order.status === "accepted");
        return [...pendingOrders, ...acceptedOrders];
      });
      
      setLoading(false);
    }, (error) => {
      console.error("Error fetching pending orders:", error);
      toast.error("Failed to fetch pending orders");
      setLoading(false);
    });
    
    const acceptedUnsubscribe = onSnapshot(acceptedOrdersQuery, (snapshot) => {
      const acceptedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as OrderItem[];
      
      console.log("Accepted orders updated:", acceptedOrders);
      
      // Update orders state by combining with pending orders
      setOrders(currentOrders => {
        const pendingOrders = currentOrders.filter(order => order.status === "pending");
        return [...pendingOrders, ...acceptedOrders];
      });
      
      setLoading(false);
    }, (error) => {
      console.error("Error fetching accepted orders:", error);
      toast.error("Failed to fetch accepted orders");
      setLoading(false);
    });
    
    // Also fetch delivered orders once (no need for real-time updates)
    const fetchDeliveredOrders = async () => {
      try {
        const deliveredOrdersQuery = query(
          collection(firestore, "orders"),
          where("status", "==", "delivered"),
          where("deliveryPersonId", "==", userId),
          orderBy("createdAt", "desc")
        );
        
        const snapshot = await getDocs(deliveredOrdersQuery);
        const deliveredOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as OrderItem[];
        
        console.log("Delivered orders fetched:", deliveredOrders);
        
        // Combine with existing orders
        setOrders(currentOrders => {
          // Filter out any delivered orders already in the state to avoid duplicates
          const nonDeliveredOrders = currentOrders.filter(order => order.status !== "delivered");
          return [...nonDeliveredOrders, ...deliveredOrders];
        });
      } catch (error) {
        console.error("Error fetching delivered orders:", error);
      }
    };
    
    fetchDeliveredOrders();
    
    // Clean up listeners when component unmounts
    return () => {
      pendingUnsubscribe();
      acceptedUnsubscribe();
    };
  }, [userId]); // Only re-run when userId changes

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
    } catch (error) {
      console.error("Error accepting order:", error);
      toast.error("Failed to accept order. Please try again.");
    }
  };

  const handleDeliver = async (orderId: string) => {
    try {
      // Update order in Firestore
      const orderRef = doc(firestore, "orders", orderId);
      await updateDoc(orderRef, {
        status: 'delivered'
      });
      
      toast.success("Order marked as delivered!");
      setSelectedOrder(null);
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
    handleDeliver
  };
}
