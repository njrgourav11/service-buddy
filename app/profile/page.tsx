"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  MapPin,
  Calendar,
  Clock,
  LogOut,
  Loader2,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [profileForm, setProfileForm] = useState({ displayName: "", phone: "" });
  const [addressForm, setAddressForm] = useState({ title: "", address: "", city: "", zip: "" });

  useEffect(() => {
    if (user) {
      setProfileForm({
        displayName: user.displayName || "",
        phone: user.phoneNumber || "" // Note: phone might be in firestore user doc if not in auth
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Fetch Bookings
          const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const bookingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
          setBookings(bookingsData);

          // Fetch Addresses
          const addressQuery = query(collection(db, `users/${user.uid}/addresses`));
          const addressSnapshot = await getDocs(addressQuery);
          const addressesData = addressSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
          setAddresses(addressesData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoadingBookings(false);
          setLoadingAddresses(false);
        }
      } else {
        setLoadingBookings(false);
        setLoadingAddresses(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [user, authLoading]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      await updateProfile(user, { displayName: profileForm.displayName });
      // Also update in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        firstName: profileForm.displayName.split(" ")[0],
        lastName: profileForm.displayName.split(" ").slice(1).join(" "),
        phone: profileForm.phone
      });
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAddAddress = async () => {
    if (!user) return;
    try {
      const newAddress = { ...addressForm, createdAt: new Date().toISOString() };
      const docRef = await addDoc(collection(db, `users/${user.uid}/addresses`), newAddress);
      setAddresses([...addresses, { id: docRef.id, ...newAddress }]);
      setIsAddingAddress(false);
      setAddressForm({ title: "", address: "", city: "", zip: "" });
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/addresses`, id));
      setAddresses(addresses.filter(addr => addr.id !== id));
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  if (authLoading || loadingBookings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
        <Button asChild>
          <a href="/auth/login">Login</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <Card className="lg:col-span-1 h-fit">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.photoURL || ""} />
                  <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{user.displayName || "User"}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" /> Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" /> My Bookings
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <MapPin className="mr-2 h-4 w-4" /> Addresses
                </Button>
                <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="bookings" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="bookings">My Bookings</TabsTrigger>
                <TabsTrigger value="profile">Profile Details</TabsTrigger>
                <TabsTrigger value="addresses">Saved Addresses</TabsTrigger>
              </TabsList>

              <TabsContent value="bookings">
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center text-gray-500">
                        No bookings found.
                      </CardContent>
                    </Card>
                  ) : (
                    bookings.map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-bold text-lg mb-1">{booking.serviceName}</h3>
                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(booking.date).toLocaleDateString()}
                                <Clock className="h-4 w-4 ml-4 mr-1" />
                                {new Date(booking.date).toLocaleTimeString()}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                {booking.address}
                              </div>
                              {booking.status === "accepted" && booking.technicianName && (
                                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
                                  <p className="text-xs text-blue-800 dark:text-blue-300 font-semibold mb-2">Assigned Technician</p>
                                  <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-sm font-bold mr-3 text-blue-800">
                                      {booking.technicianName[0]}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">{booking.technicianName}</p>
                                      <p className="text-xs text-gray-500">{booking.technicianPhone}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <Badge className={
                                booking.status === "completed" ? "bg-green-100 text-green-800" :
                                  booking.status === "confirmed" ? "bg-blue-100 text-blue-800" :
                                    booking.status === "accepted" ? "bg-purple-100 text-purple-800" :
                                      "bg-yellow-100 text-yellow-800"
                              }>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                              <p className="font-bold mt-2">₹{booking.amount}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="profile">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Profile Details</CardTitle>
                      <CardDescription>Manage your personal information</CardDescription>
                    </div>
                    <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={profileForm.displayName}
                              onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={profileForm.phone}
                              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleUpdateProfile}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-900">
                          {user.displayName || "Not set"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-900">
                          {user.email}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone</label>
                        <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-900">
                          {profileForm.phone || "Not set"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Saved Addresses</CardTitle>
                      <CardDescription>Manage your delivery addresses</CardDescription>
                    </div>
                    <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" /> Add New
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Address</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Address Title (e.g. Home, Office)</Label>
                            <Input
                              id="title"
                              placeholder="Home"
                              value={addressForm.title}
                              onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address">Full Address</Label>
                            <Textarea
                              id="address"
                              placeholder="123 Main St, Apt 4B"
                              value={addressForm.address}
                              onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                placeholder="Mumbai"
                                value={addressForm.city}
                                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="zip">ZIP Code</Label>
                              <Input
                                id="zip"
                                placeholder="400001"
                                value={addressForm.zip}
                                onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddAddress}>Save Address</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {loadingAddresses ? (
                      <div className="flex justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      </div>
                    ) : addresses.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No addresses saved yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                          <div key={addr.id} className="border rounded-lg p-4 relative group">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteAddress(addr.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <h4 className="font-bold mb-1">{addr.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{addr.address}</p>
                            <p className="text-sm text-gray-500 mt-1">{addr.city}, {addr.zip}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div >
  );
}