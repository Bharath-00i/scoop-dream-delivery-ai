
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: "vanilla", name: "Classic Vanilla", price: 3.99, quantity: 2 },
    { id: "chocolate", name: "Double Chocolate", price: 4.49, quantity: 1 },
  ]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "card",
  });
  
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;
  
  const handleQuantityChange = (id: string, change: number) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };
  
  const handleRemoveItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Simple validation
    if (name === "email" && value && !value.includes("@")) {
      setFormErrors({ ...formErrors, [name]: "Please enter a valid email address" });
    } else if (value.trim() === "") {
      setFormErrors({ ...formErrors, [name]: "This field is required" });
    } else {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we'd handle payment and submission here
    console.log("Order submitted:", { formData, cartItems });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-mint-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <motion.h1 
          className="text-4xl md:text-5xl font-heading font-bold text-center mb-12 text-strawberry"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Checkout
        </motion.h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="mb-6">Looks like you haven't added any ice cream to your cart yet.</p>
            <Button asChild className="bg-strawberry hover:bg-strawberry/90 text-white">
              <a href="/menu">Browse Menu</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2">
              <motion.div 
                className="bg-white p-6 rounded-2xl shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-4 flex justify-between">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">${item.price} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200"
                        >
                          +
                        </button>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="ml-4 text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-4">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Checkout Form */}
            <motion.div 
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold mb-6">Delivery Information</h2>
                
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Your full name"
                      required
                    />
                    {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="your.email@example.com"
                      required
                    />
                    {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="(123) 456-7890"
                      required
                    />
                    {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Your delivery address"
                      rows={3}
                      required
                    />
                    {formErrors.address && <p className="text-red-500 text-sm">{formErrors.address}</p>}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="payment-card"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === "card"}
                          onChange={() => setFormData({...formData, paymentMethod: "card"})}
                          className="accent-strawberry"
                        />
                        <Label htmlFor="payment-card">Credit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="payment-paypal"
                          name="paymentMethod"
                          value="paypal"
                          checked={formData.paymentMethod === "paypal"}
                          onChange={() => setFormData({...formData, paymentMethod: "paypal"})}
                          className="accent-strawberry"
                        />
                        <Label htmlFor="payment-paypal">PayPal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="payment-cash"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === "cash"}
                          onChange={() => setFormData({...formData, paymentMethod: "cash"})}
                          className="accent-strawberry"
                        />
                        <Label htmlFor="payment-cash">Cash on Delivery</Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  className="w-full mt-8 bg-strawberry hover:bg-strawberry/90 text-white text-lg py-6"
                >
                  Complete Order
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
