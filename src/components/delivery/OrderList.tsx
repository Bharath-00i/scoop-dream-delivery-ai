
import { OrderItem } from "@/types";
import OrderCard from "./OrderCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";

interface OrderListProps {
  orders: OrderItem[];
  loading: boolean;
  onAccept: (orderId: string) => void;
  onDeliver: (orderId: string) => void;
  onShowRoute: (order: OrderItem) => void;
  type: "current" | "completed";
}

export default function OrderList({ 
  orders, 
  loading, 
  onAccept, 
  onDeliver,
  onShowRoute,
  type
}: OrderListProps) {
  const title = type === "current" ? "Current Orders" : "Completed Orders";
  
  // Filter orders based on type
  const filteredOrders = type === "current" 
    ? orders.filter(order => order.status === 'pending' || order.status === 'accepted')
    : orders.filter(order => order.status === 'delivered');
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-10">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">
            {type === "current" ? 
              "No pending or accepted orders available" : 
              "No completed orders yet"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onAccept={onAccept} 
              onDeliver={onDeliver}
              onShowRoute={onShowRoute}
            />
          ))}
        </div>
      )}
    </div>
  );
}
