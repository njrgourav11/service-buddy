"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Briefcase,
  DollarSign,
  CheckCircle2,
  XCircle,
  Loader2,
  MapPin,
  Phone,
  Mail,
  FileText,
  User,
  Search
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit, doc, updateDoc, where } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminDashboard() {
  const { user, role, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeTechnicians: 0,
    totalUsers: 0
  });
  const [bookings, setBookings] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedTech, setSelectedTech] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [assignTechId, setAssignTechId] = useState<string>("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    if (!user || role !== "admin") return;

    try {
      setLoading(true);
      // Fetch Bookings
      const bookingsSnap = await getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc")));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bookingsData = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      setBookings(bookingsData);

      // Fetch Technicians
      const techniciansSnap = await getDocs(collection(db, "technicians"));
      const techniciansData = techniciansSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTechnicians(techniciansData);

      // Fetch Users
      const usersSnap = await getDocs(collection(db, "users"));
      const usersData = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsersList(usersData);

      // Calculate Stats
      const totalRevenue = bookingsData.reduce((acc: number, curr: { amount?: number }) => acc + (curr.amount || 0), 0);
      const activeTechs = techniciansData.filter((t: any) => t.status === "approved").length;

      setStats({
        totalBookings: bookingsSnap.size,
        totalRevenue,
        activeTechnicians: activeTechs,
        totalUsers: usersSnap.size
      });

    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [user, role, authLoading]);

  const handleUpdateStatus = async (techId: string, status: "approved" | "rejected") => {
    setActionLoading(true);
    try {
      await updateDoc(doc(db, "technicians", techId), { status });

      // Update local state
      setTechnicians(prev => prev.map(t => t.id === techId ? { ...t, status } : t));
      setSelectedTech(null);

      // Refresh stats if needed
      const activeTechs = technicians.map(t => t.id === techId ? { ...t, status } : t).filter((t: any) => t.status === "approved").length;
      setStats(prev => ({ ...prev, activeTechnicians: activeTechs }));

    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignTechnician = async () => {
    if (!selectedBooking || !assignTechId) return;
    setActionLoading(true);

    try {
      const tech = technicians.find(t => t.id === assignTechId);
      await updateDoc(doc(db, "bookings", selectedBooking.id), {
        technicianId: assignTechId,
        technicianName: tech?.fullName || "Unknown",
        status: "assigned"
      });

      // Update local state
      setBookings(prev => prev.map(b => b.id === selectedBooking.id ? {
        ...b,
        technicianId: assignTechId,
        technicianName: tech?.fullName,
        status: "assigned"
      } : b));

      setSelectedBooking(null);
      setAssignTechId("");
    } catch (error) {
      console.error("Error assigning technician:", error);
      alert("Failed to assign technician");
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user || role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-4">You do not have permission to view this page.</p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  const approvedTechnicians = technicians.filter(t => t.status === "approved");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden lg:block fixed h-full">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">ServiceBuddy</h1>
          <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          <Button variant={activeTab === "overview" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("overview")}>
            <LayoutDashboard className="mr-2 h-4 w-4" /> Overview
          </Button>
          <Button variant={activeTab === "bookings" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("bookings")}>
            <Calendar className="mr-2 h-4 w-4" /> Bookings
          </Button>
          <Button variant={activeTab === "technicians" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("technicians")}>
            <Briefcase className="mr-2 h-4 w-4" /> Technicians
          </Button>
          <Button variant={activeTab === "users" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("users")}>
            <Users className="mr-2 h-4 w-4" /> Users
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 lg:ml-64">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={user.photoURL || ""} />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Bookings</p>
                    <h3 className="text-2xl font-bold">{stats.totalBookings}</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="p-3 bg-green-100 text-green-600 rounded-full">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <h3 className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Technicians</p>
                    <h3 className="text-2xl font-bold">{stats.activeTechnicians}</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Users</p>
                    <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Calendar className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{booking.serviceName}</p>
                          <p className="text-sm text-gray-500">{booking.userName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{booking.amount}</p>
                        <Badge variant={booking.status === "completed" ? "default" : "secondary"}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {bookings.length === 0 && <p className="text-gray-500 text-center">No bookings yet.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>Manage and assign bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No bookings found.</p>
                  ) : (
                    <div className="rounded-md border">
                      <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 dark:bg-gray-900 font-medium text-sm">
                        <div className="col-span-2">Service Details</div>
                        <div>Customer</div>
                        <div>Date & Time</div>
                        <div>Status</div>
                        <div className="text-right">Action</div>
                      </div>
                      {bookings.map((booking) => (
                        <div key={booking.id} className="grid grid-cols-6 gap-4 p-4 border-t items-center text-sm">
                          <div className="col-span-2">
                            <p className="font-semibold">{booking.serviceName}</p>
                            <p className="text-xs text-gray-500">{booking.address}</p>
                          </div>
                          <div>
                            <p className="font-medium">{booking.userName}</p>
                          </div>
                          <div>
                            <p>{new Date(booking.date).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-500">{booking.time}</p>
                          </div>
                          <div>
                            <Badge variant={
                              booking.status === "confirmed" ? "default" :
                                booking.status === "assigned" ? "secondary" :
                                  booking.status === "completed" ? "outline" : "destructive"
                            }>
                              {booking.status}
                            </Badge>
                            {booking.technicianName && (
                              <p className="text-xs text-gray-500 mt-1">Tech: {booking.technicianName}</p>
                            )}
                          </div>
                          <div className="text-right">
                            {booking.status === "confirmed" || booking.status === "pending_verification" ? (
                              <Button size="sm" onClick={() => setSelectedBooking(booking)}>Assign</Button>
                            ) : (
                              <Button size="sm" variant="outline" disabled>
                                {booking.status === "assigned" ? "Reassign" : "View"}
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technicians">
            <Card>
              <CardHeader>
                <CardTitle>Technician Applications</CardTitle>
                <CardDescription>Manage technician onboarding requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {technicians.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No technician applications found.</p>
                  ) : (
                    technicians.map((tech) => (
                      <div key={tech.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>{tech.fullName?.[0] || "T"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{tech.fullName}</p>
                            <p className="text-sm text-gray-500 capitalize">{tech.category} • {tech.experience} years exp</p>
                            <p className="text-xs text-gray-400">{tech.city}, {tech.state}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={
                            tech.status === "approved" ? "default" :
                              tech.status === "rejected" ? "destructive" : "secondary"
                          }>
                            {tech.status}
                          </Badge>
                          <Button variant="outline" size="sm" onClick={() => setSelectedTech(tech)}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>List of all registered users on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usersList.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No users found.</p>
                  ) : (
                    usersList.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-semibold">{u.displayName || u.firstName + " " + u.lastName || "Unknown User"}</p>
                            <p className="text-sm text-gray-500">{u.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="capitalize">{u.role || "user"}</Badge>
                          <p className="text-xs text-gray-400 mt-1">
                            Joined: {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Technician Details Modal */}
      <Dialog open={!!selectedTech} onOpenChange={(open) => !open && setSelectedTech(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Technician Details</DialogTitle>
            <DialogDescription>Review application for {selectedTech?.fullName}</DialogDescription>
          </DialogHeader>

          {selectedTech && (
            <div className="grid gap-6 py-4">
              {/* Personal Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center"><User className="mr-2 h-4 w-4" /> Personal Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Full Name</span>
                    <span className="font-medium">{selectedTech.fullName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Email</span>
                    <span className="font-medium">{selectedTech.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Phone</span>
                    <span className="font-medium">{selectedTech.phone}</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-800" />

              {/* Location */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center"><MapPin className="mr-2 h-4 w-4" /> Location</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="col-span-2">
                    <span className="text-gray-500 block">Address</span>
                    <span className="font-medium">{selectedTech.address}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">City</span>
                    <span className="font-medium">{selectedTech.city}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Area</span>
                    <span className="font-medium">{selectedTech.area || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">State</span>
                    <span className="font-medium">{selectedTech.state}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Zip Code</span>
                    <span className="font-medium">{selectedTech.zip}</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-800" />

              {/* Professional */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center"><Briefcase className="mr-2 h-4 w-4" /> Professional Profile</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Category</span>
                    <span className="font-medium capitalize">{selectedTech.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Experience</span>
                    <span className="font-medium">{selectedTech.experience} Years</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 block">Bio</span>
                    <p className="font-medium mt-1">{selectedTech.bio || "No bio provided."}</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-800" />

              {/* Documents */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center"><FileText className="mr-2 h-4 w-4" /> Documents</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 text-center bg-gray-50 dark:bg-gray-900">
                    <p className="text-sm font-medium mb-2">Aadhaar Front</p>
                    <div className="h-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      Preview Unavailable
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 text-center bg-gray-50 dark:bg-gray-900">
                    <p className="text-sm font-medium mb-2">Aadhaar Back</p>
                    <div className="h-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      Preview Unavailable
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 text-center bg-gray-50 dark:bg-gray-900">
                    <p className="text-sm font-medium mb-2">Profile Photo</p>
                    <div className="h-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      Preview Unavailable
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {selectedTech?.status === "pending" && (
              <>
                <Button variant="destructive" onClick={() => handleUpdateStatus(selectedTech.id, "rejected")} disabled={actionLoading}>
                  {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject Application"}
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus(selectedTech.id, "approved")} disabled={actionLoading}>
                  {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve Application"}
                </Button>
              </>
            )}
            {selectedTech?.status !== "pending" && (
              <Button variant="secondary" disabled>
                Application {selectedTech?.status}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Technician Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Technician</DialogTitle>
            <DialogDescription>Select a technician for {selectedBooking?.serviceName}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select value={assignTechId} onValueChange={setAssignTechId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Technician" />
              </SelectTrigger>
              <SelectContent>
                {approvedTechnicians.length === 0 ? (
                  <SelectItem value="none" disabled>No active technicians found</SelectItem>
                ) : (
                  approvedTechnicians.map(tech => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.fullName} ({tech.category})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelectedBooking(null)}>Cancel</Button>
            <Button onClick={handleAssignTechnician} disabled={!assignTechId || actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Assign Technician
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}