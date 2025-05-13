
import { OrderItem } from "@/types";
import OrderCard from "./OrderCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  
  const handleRefresh = () => {
    window.location.reload();
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          className="flex items-center gap-1"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-10">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 mb-4">
            {type === "current" ? "No orders available at the moment" : "No completed orders yet"}
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh Orders
          </Button>
        </div>
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
