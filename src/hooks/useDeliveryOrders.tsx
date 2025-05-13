
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
    setLoading(true);
    console.log("Fetching ALL orders for delivery dashboard");
    
    // Set up real-time listener for ALL orders in the system without filtering
    const ordersQuery = query(
      collection(firestore, "orders"),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as OrderItem[];
      
      console.log("Total orders fetched:", fetchedOrders.length);
      
      if (fetchedOrders.length === 0) {
        console.log("No orders found in the database");
      } else {
        console.log("Orders found! First order:", fetchedOrders[0]);
      }
      
      // Show ALL orders in the dashboard regardless of status
      setOrders(fetchedOrders);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
      setLoading(false);
    });
    
    return () => {
      unsubscribe();
    };
  }, []); // Remove userId dependency to fetch ALL orders regardless of user

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
