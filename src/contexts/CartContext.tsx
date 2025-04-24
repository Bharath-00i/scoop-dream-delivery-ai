
import React, { createContext, useContext, useState } from 'react';
import { toast } from "sonner";
import { FlavorItem } from '@/types';

export interface CartItem extends FlavorItem {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: FlavorItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: FlavorItem) => {
    const existingItem = items.find(i => i.id === item.id);
    if (existingItem) {
      setItems(
        items.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
      toast.success(`${item.name} quantity increased`, {
        description: `You now have ${existingItem.quantity + 1} in your cart`
      });
    } else {
      setItems([...items, { ...item, quantity: 1 }]);
      toast.success(`${item.name} added to cart`, {
        description: "Your item has been added to the cart"
      });
    }
  };

  const removeFromCart = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };
  
  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart,
      total 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
