
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { QrCode } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "qr">("cod");

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
          Your Cart
        </motion.h1>

        {items.length === 0 ? (
          <div className="text-center">
            <p className="text-xl mb-4">Your cart is empty</p>
            <Button asChild>
              <Link to="/menu">Browse Menu</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-4 py-4 border-b">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">${item.price} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Payment Details</h2>
                <div className="space-y-6">
                  <div>
                    <p className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between mb-4">
                      <span>Delivery Fee</span>
                      <span>$2.99</span>
                    </p>
                    <p className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${(total + 2.99).toFixed(2)}</span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Payment Method</h3>
                    <RadioGroup 
                      value={paymentMethod} 
                      onValueChange={(value) => setPaymentMethod(value as "cod" | "qr")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod">Pay on Delivery</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="qr" id="qr" />
                        <Label htmlFor="qr">QR Code Payment</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {paymentMethod === "qr" && (
                    <div className="border rounded-lg p-4">
                      <div className="aspect-square relative">
                        <img 
                          src="/lovable-uploads/949f016d-1357-4fd2-ac94-3f1fe71d56bb.png" 
                          alt="Payment QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-center mt-2 text-sm text-gray-600">
                        Scan to pay with any UPI app
                      </p>
                    </div>
                  )}

                  <Button className="w-full">
                    {paymentMethod === "cod" ? "Place Order" : "I have completed the payment"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
