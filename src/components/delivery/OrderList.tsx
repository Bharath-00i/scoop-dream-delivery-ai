
import { OrderItem } from "@/types";
import OrderCard from "./OrderCard";

interface OrderListProps {
  orders: OrderItem[];
  loading: boolean;
  onAccept: (orderId: string) => void;
  onDeliver: (orderId: string) => void;
  type: "current" | "completed";
}

export default function OrderList({ orders, loading, onAccept, onDeliver, type }: OrderListProps) {
  const title = type === "current" ? "Current Orders" : "Completed Orders";
  const filteredOrders = type === "current" 
    ? orders.filter(order => order.status === 'pending' || order.status === 'accepted')
    : orders.filter(order => order.status === 'delivered');
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin w-8 h-8 border-4 border-strawberry border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-500">Loading orders...</p>
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
