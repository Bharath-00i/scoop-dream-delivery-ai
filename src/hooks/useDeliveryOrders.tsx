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
    
    // Set up real-time listener for ALL orders in the system
    const ordersQuery = query(
      collection(firestore, "orders"),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as OrderItem[];
      
      console.log("Orders updated:", fetchedOrders.length, "orders found");
      
      // Process orders based on their status
      const pendingOrders = fetchedOrders.filter(order => order.status === "pending");
      const acceptedOrders = fetchedOrders.filter(order => 
        order.status === "accepted" && order.deliveryPersonId === userId
      );
      const deliveredOrders = fetchedOrders.filter(order => 
        order.status === "delivered" && order.deliveryPersonId === userId
      );
      
      console.log("Pending orders:", pendingOrders.length);
      console.log("Accepted orders for this user:", acceptedOrders.length);
      console.log("Delivered orders for this user:", deliveredOrders.length);
      
      // Combine orders in the desired order
      const combinedOrders = [...pendingOrders, ...acceptedOrders, ...deliveredOrders];
      setOrders(combinedOrders);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
      setLoading(false);
    });
    
    // Clean up the listener when component unmounts
    return () => {
      unsubscribe();
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
