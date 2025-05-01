
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
  email?: string;
  phone?: string;
  paymentMethod?: string;
  createdAt?: Date;
  userId?: string;
}
