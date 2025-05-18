
import { OrderItem } from "@/types";
import { MapPin, Check, Route } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderCardProps {
  order: OrderItem;
  onAccept: (orderId: string) => void;
  onDeliver: (orderId: string) => void;
  onShowRoute: (order: OrderItem) => void;
}

export default function OrderCard({ order, onAccept, onDeliver, onShowRoute }: OrderCardProps) {
  // Safely display order information with fallbacks for any missing fields
  const orderItems = Array.isArray(order.items) ? order.items : [];
  const orderTotal = typeof order.total === 'number' ? order.total.toFixed(2) : '0.00';
  const customerName = order.customerName || 'Customer';
  const address = order.address || 'No address provided';

  return (
    <div 
      className={`border rounded-lg p-4 ${
        order.status === 'accepted' ? 'border-green-300 bg-green-50' : 
        order.status === 'delivered' ? 'border-blue-300 bg-blue-50' :
        'border-orange-300 bg-orange-50'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{customerName}</h3>
          <p className="text-sm text-gray-600 flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {address}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold">${orderTotal}</p>
          <span className={`text-xs px-2 py-1 rounded-full ${
            order.status === 'pending' ? 'bg-orange-100 text-orange-800' :
            order.status === 'accepted' ? 'bg-green-100 text-green-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-sm font-medium">Items:</p>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {orderItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
      
      <div className="mt-4 flex justify-end space-x-2">
        {order.status === 'pending' && (
          <Button 
            variant="outline" 
            size="sm"
            className="border-green-500 text-green-500 hover:bg-green-50"
            onClick={() => onAccept(order.id)}
          >
            <Check className="w-4 h-4 mr-1" /> Accept
          </Button>
        )}
        
        {order.status === 'accepted' && (
          <>
            <Button 
              variant="outline" 
              size="sm"
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
              onClick={() => onShowRoute(order)}
            >
              <Route className="w-4 h-4 mr-1" /> Show Route
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-green-500 text-green-500 hover:bg-green-50"
              onClick={() => onDeliver(order.id)}
            >
              <Check className="w-4 h-4 mr-1" /> Delivered
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
