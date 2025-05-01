
export interface FlavorItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: number;
  category: "regular" | "premium" | "seasonal";
}

export interface OrderItem {
  id: string;
  customerName: string;
  address: string;
  items: string[];
  total: number;
  status: 'pending' | 'accepted' | 'delivered';
  customerLocation?: {
    lat: number;
    lng: number;
  };
  deliveryPerson?: {
    name: string;
    phone: string;
  };
  deliveryPersonId?: string;
  email?: string;
  phone?: string;
  paymentMethod?: string;
  createdAt: any; // Changed from Date to any to handle Firestore timestamps
  userId?: string;
}
