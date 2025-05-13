
import { OrderItem } from "@/types";
import OrderCard from "./OrderCard";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderListProps {
  orders: OrderItem[];
  loading: boolean;
  onAccept: (orderId: string) => void;
  onDeliver: (orderId: string) => void;
  type: "current" | "completed";
}

export default function OrderList({ orders, loading, onAccept, onDeliver, type }: OrderListProps) {
  const title = type === "current" ? "Current Orders" : "Completed Orders";
  
  // Filter orders based on type
  const filteredOrders = type === "current" 
    ? orders.filter(order => order.status === 'pending' || order.status === 'accepted')
    : orders.filter(order => order.status === 'delivered');
  
  console.log(`${type} orders count:`, filteredOrders.length);
  if (filteredOrders.length > 0) {
    console.log(`First ${type} order:`, filteredOrders[0]);
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center py-10 text-gray-500">
          {type === "current" ? "No orders available at the moment" : "No completed orders yet"}
        </p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onAccept={onAccept} 
              onDeliver={onDeliver} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
