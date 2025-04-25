
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "delivered" | "cancelled";
  items: { name: string; quantity: number }[];
}

const Account = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses">("profile");
  
  // Mock order history data - in a real app, this would come from Firestore
  const [orders] = useState<Order[]>([
    {
      id: "order-1",
      date: "2025-04-20",
      total: 12.47,
      status: "delivered",
      items: [
        { name: "Classic Vanilla", quantity: 2 },
        { name: "Double Chocolate", quantity: 1 }
      ]
    },
    {
      id: "order-2",
      date: "2025-04-15",
      total: 9.98,
      status: "delivered",
      items: [
        { name: "Fresh Strawberry", quantity: 1 },
        { name: "Mint Chocolate Chip", quantity: 1 }
      ]
    },
    {
      id: "order-3",
      date: "2025-04-08",
      total: 15.96,
      status: "cancelled",
      items: [
        { name: "Cookie Dough", quantity: 2 },
        { name: "Mango Tango Sorbet", quantity: 1 }
      ]
    }
  ]);
  
  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || "",
    email: currentUser?.email || "",
    phone: "555-123-4567",
  });
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, would update profile in Firebase Auth and Firestore
    console.log("Profile update:", profileData);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-mint-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <motion.h1 
          className="text-4xl md:text-5xl font-heading font-bold text-center mb-8 text-strawberry"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Account
        </motion.h1>
        
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex border-b mb-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-3 px-6 font-medium ${activeTab === "profile" 
                ? "border-b-2 border-strawberry text-strawberry" 
                : "text-gray-500 hover:text-strawberry"}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`py-3 px-6 font-medium ${activeTab === "orders" 
                ? "border-b-2 border-strawberry text-strawberry" 
                : "text-gray-500 hover:text-strawberry"}`}
            >
              Order History
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`py-3 px-6 font-medium ${activeTab === "addresses" 
                ? "border-b-2 border-strawberry text-strawberry" 
                : "text-gray-500 hover:text-strawberry"}`}
            >
              Saved Addresses
            </button>
          </div>
          
          {/* Profile Tab Content */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
              
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={profileData.displayName}
                    onChange={handleProfileChange}
                    className="w-full p-3 border rounded-lg border-gray-300"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full p-3 border rounded-lg border-gray-300"
                    disabled
                  />
                  <p className="text-sm text-gray-500">Email cannot be changed</p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className="w-full p-3 border rounded-lg border-gray-300"
                  />
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    type="button"
                    variant="outline"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => logout()}
                  >
                    Sign Out
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-strawberry hover:bg-strawberry/90 text-white"
                  >
                    Update Profile
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
          
          {/* Orders Tab Content */}
          {activeTab === "orders" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-6">Order History</h2>
              
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">You haven't placed any orders yet.</p>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">Order #{order.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${order.total.toFixed(2)}</p>
                          <span className={`text-sm px-2 py-1 rounded ${
                            order.status === "delivered" 
                              ? "bg-green-100 text-green-800" 
                              : order.status === "cancelled" 
                                ? "bg-red-100 text-red-800" 
                                : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{item.name}</span>
                            <span>×{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-right">
                        <button className="text-sm text-strawberry hover:underline">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
          
          {/* Addresses Tab Content */}
          {activeTab === "addresses" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-6">Saved Addresses</h2>
              
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Home</p>
                    <p className="text-gray-600 mt-1">123 Ice Cream Lane</p>
                    <p className="text-gray-600">Dessert City, CA 90210</p>
                    <p className="text-gray-600 mt-1">555-123-4567</p>
                  </div>
                  <div className="space-y-2">
                    <button className="text-sm text-strawberry hover:underline block">Edit</button>
                    <button className="text-sm text-red-500 hover:underline block">Delete</button>
                  </div>
                </div>
              </div>
              
              <Button className="w-full bg-strawberry hover:bg-strawberry/90 text-white">
                Add New Address
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
