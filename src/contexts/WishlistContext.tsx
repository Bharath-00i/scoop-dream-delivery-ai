
import React, { createContext, useContext, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface WishlistContextType {
  items: FlavorItem[];
  addToWishlist: (item: FlavorItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<FlavorItem[]>([]);
  const { toast } = useToast();

  const addToWishlist = (item: FlavorItem) => {
    if (!items.find(i => i.id === item.id)) {
      setItems(current => [...current, item]);
      toast({
        title: "Added to wishlist",
        description: `${item.name} has been added to your wishlist.`
      });
    }
  };

  const removeFromWishlist = (id: string) => {
    setItems(current => current.filter(item => item.id !== id));
  };

  const isInWishlist = (id: string) => items.some(item => item.id === id);

  return (
    <WishlistContext.Provider value={{ 
      items, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
