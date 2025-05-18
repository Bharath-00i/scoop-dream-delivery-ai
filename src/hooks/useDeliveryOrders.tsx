
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc, doc, orderBy, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { toast } from 'sonner';
import { OrderItem } from '@/types';

export function useDeliveryOrders() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      console.log("Fetching delivery orders");
      
      // Query all orders
      const ordersQuery = query(
        collection(firestore, "orders"),
        orderBy("createdAt", "desc")
      );
      
      const snapshot = await getDocs(ordersQuery);
      
      if (snapshot.empty) {
        console.log("No orders found in database");
        setOrders([]);
      } else {
        const fetchedOrders = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt
          };
        }) as OrderItem[];
        
        console.log("Orders fetched:", fetchedOrders.length);
        setOrders(fetchedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh orders (manually triggered)
  const refreshOrders = () => {
    fetchOrders();
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

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
      toast.success("Order accepted!");
      
      // Refresh orders after accepting
      fetchOrders();
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
        status: 'delivered',
        deliveredAt: Timestamp.now()
      });
      
      toast.success("Order marked as delivered!");
      
      // Reset selected order if it was the one being delivered
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null);
      }
      
      // Refresh orders after delivering
      fetchOrders();
    } catch (error) {
      console.error("Error delivering order:", error);
      toast.error("Failed to mark order as delivered. Please try again.");
    }
  };

  const handleShowRoute = (order: OrderItem) => {
    setSelectedOrder(order);
  };

  return {
    orders,
    loading,
    selectedOrder,
    setSelectedOrder,
    handleAccept,
    handleDeliver,
    handleShowRoute,
    refreshOrders
  };
}
