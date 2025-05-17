
import { OrderItem } from "@/types";
import OrderCard from "./OrderCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface OrderListProps {
  orders: OrderItem[];
  loading: boolean;
  onAccept: (orderId: string) => void;
  onDeliver: (orderId: string) => void;
  type: "current" | "completed";
  onRefreshOrders: () => void; // New prop to trigger refresh
}

export default function OrderList({ 
  orders, 
  loading, 
  onAccept, 
  onDeliver, 
  type,
  onRefreshOrders 
}: OrderListProps) {
  const title = type === "current" ? "Current Orders" : "Completed Orders";
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // Filter orders based on type - ensure we're showing all relevant orders
  const filteredOrders = type === "current" 
    ? orders.filter(order => order.status === 'pending' || order.status === 'accepted')
    : orders.filter(order => order.status === 'delivered');
  
  console.log(`${type} orders count:`, filteredOrders.length);
  if (filteredOrders.length > 0) {
    console.log(`First ${type} order:`, filteredOrders[0]);
  } else {
    console.log(`No ${type} orders found. Total orders available:`, orders.length);
    // Debug all orders to see what's available
    if (orders.length > 0) {
      console.log("All order statuses:", orders.map(order => order.status));
    }
  }
  
  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    setLastRefresh(new Date());
    toast.info("Refreshing orders...");
    
    // Call the onRefreshOrders prop instead of reloading the page
    onRefreshOrders();
  };

  // Force refresh when component mounts
  useEffect(() => {
    console.log("OrderList for", type, "updated at", lastRefresh.toISOString());
  }, [type, lastRefresh]);
  
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
            {type === "current" ? 
              "No pending or accepted orders available" : 
              "No completed orders yet"
            }
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
