
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FlavorItem } from '@/types';

export default function Admin() {
  const { currentUser, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'regular',
    available: '10',
  });
  const [menuItems, setMenuItems] = useState<FlavorItem[]>([
    {
      id: "vanilla",
      name: "Classic Vanilla",
      description: "Smooth and creamy vanilla made with real Madagascar vanilla beans",
      price: 3.99,
      image: "/placeholder.svg",
      available: 24,
      category: "regular"
    },
    {
      id: "chocolate",
      name: "Double Chocolate",
      description: "Rich chocolate ice cream with chocolate chips throughout",
      price: 4.49,
      image: "/placeholder.svg",
      available: 18,
      category: "regular"
    },
  ]);

  // Redirect if not admin
  if (!currentUser || !isAdmin()) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: FlavorItem = {
      id: formData.name.toLowerCase().replace(/\s+/g, '-'),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: "/placeholder.svg",
      available: parseInt(formData.available),
      category: formData.category as "regular" | "premium" | "seasonal"
    };
    
    setMenuItems([...menuItems, newItem]);
    
    toast.success('Menu item added successfully!');
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'regular',
      available: '10',
    });
  };

  const handleDelete = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    toast.success('Item removed successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-mint-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <motion.h1 
          className="text-4xl md:text-5xl font-heading font-bold text-center mb-8 text-strawberry"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Admin Dashboard
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Add New Menu Item</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Item Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="available">Available Quantity</Label>
                  <Input 
                    id="available" 
                    name="available" 
                    type="number"
                    min="0"
                    value={formData.available}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="regular">Regular</option>
                    <option value="premium">Premium</option>
                    <option value="seasonal">Seasonal</option>
                  </select>
                </div>
                
                <Button type="submit" className="w-full bg-strawberry hover:bg-strawberry/90">
                  Add Item
                </Button>
              </div>
            </form>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Current Menu Items</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Price</th>
                      <th className="text-left py-2">Category</th>
                      <th className="text-left py-2">Available</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-3">{item.name}</td>
                        <td className="py-3">${item.price.toFixed(2)}</td>
                        <td className="py-3">{item.category}</td>
                        <td className="py-3">{item.available}</td>
                        <td className="py-3">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
