
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { collection, addDoc, GeoPoint } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

const Checkout = () => {
  const { items, total: cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
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
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const subtotal = cartTotal;
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic form validation
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors({ ...formErrors, ...errors });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format items for order
      const orderItems = items.map(item => `${item.name} (${item.quantity})`);
      
      // Create mock geo location for the customer (in a real app, you would use a geocoding API)
      // This is just a random location near the shop for demonstration purposes
      const customerLocation = {
        lat: 34.0522 + (Math.random() * 0.02 - 0.01), // Random offset from Los Angeles
        lng: -118.2437 + (Math.random() * 0.02 - 0.01)
      };
      
      // Create order in Firestore
      const orderRef = await addDoc(collection(firestore, "orders"), {
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        items: orderItems,
        total: total,
        status: "pending",
        createdAt: new Date(),
        paymentMethod: formData.paymentMethod,
        customerLocation: customerLocation,
        userId: currentUser ? currentUser.uid : "guest"
      });
      
      // Show success toast
      toast.success("Order placed successfully!", {
        description: "A delivery person will accept your order soon.",
      });
      
      // Clear cart
      clearCart();
      
      // Navigate to home page after a short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (items.length === 0) {
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
          
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="mb-6">Looks like you haven't added any ice cream to your cart yet.</p>
            <Button asChild className="bg-strawberry hover:bg-strawberry/90 text-white">
              <a href="/menu">Browse Menu</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
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
                {items.map((item) => (
                  <div key={item.id} className="py-4 flex justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">${item.price} each</p>
                    </div>
                    <div>
                      <p className="font-medium">{item.quantity} x ${item.price} = ${(item.quantity * item.price).toFixed(2)}</p>
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
                disabled={isSubmitting}
                className="w-full mt-8 bg-strawberry hover:bg-strawberry/90 text-white text-lg py-6"
              >
                {isSubmitting ? "Processing..." : "Complete Order"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
