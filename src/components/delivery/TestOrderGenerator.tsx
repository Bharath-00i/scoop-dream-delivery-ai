
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { toast } from "sonner";
import { Package } from "lucide-react";

export default function TestOrderGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [customerName, setCustomerName] = useState("Test Customer");
  const [address, setAddress] = useState("123 Test Street");

  const generateTestOrder = async () => {
    setIsGenerating(true);
    try {
      // Create mock location near the shop
      const customerLocation = {
        lat: 34.0522 + (Math.random() * 0.02 - 0.01), // Random offset from Los Angeles
        lng: -118.2437 + (Math.random() * 0.02 - 0.01)
      };

      // Create sample order items
      const testItems = [
        "Vanilla Ice Cream (2)",
        "Chocolate Chip (1)",
        "Strawberry Cone (1)"
      ];

      // Create order data with explicit status
      const orderData = {
        customerName,
        address,
        items: testItems,
        total: 18.99,
        status: "pending", // Explicitly set as pending
        createdAt: serverTimestamp(), // Use serverTimestamp for consistency
        paymentMethod: "card",
        customerLocation,
        userId: "test-user-id",
        email: "test@example.com",
        phone: "555-123-4567"
      };

      console.log("Creating test order with data:", orderData);

      // Add to Firestore
      const docRef = await addDoc(collection(firestore, "orders"), orderData);
      console.log("Test order successfully created with ID:", docRef.id);
      toast.success(`Test order created with ID: ${docRef.id}`);
      
      // Force a refresh of the data
      // The real-time listener should pick this up, but just in case
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error creating test order:", error);
      toast.error("Failed to create test order");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full border-2 border-pink-200">
      <CardHeader className="bg-pink-50">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Test Order Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer-name">Customer Name</Label>
            <Input 
              id="customer-name" 
              value={customerName} 
              onChange={(e) => setCustomerName(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address</Label>
            <Input 
              id="address" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-pink-50 pb-4">
        <Button 
          onClick={generateTestOrder} 
          disabled={isGenerating}
          className="w-full bg-pink-500 hover:bg-pink-600"
        >
          {isGenerating ? "Creating..." : "Generate Test Order"}
        </Button>
      </CardFooter>
    </Card>
  );
}
