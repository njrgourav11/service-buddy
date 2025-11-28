"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Briefcase,
  DollarSign,
  XCircle,
  Loader2,
  MapPin,
  FileText,
  User,
  Menu,
  Activity,
  Package,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAdminStats, approveTechnician, assignTechnician, updateUserRole } from "@/actions/admin";
import { getSystemLogs } from "@/actions/logger";
import { getServicesForAdmin, createService, updateService, deleteService } from "@/actions/service";

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
  const [logs, setLogs] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedTech, setSelectedTech] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [assignTechId, setAssignTechId] = useState<string>("");
  const [actionLoading, setActionLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Service Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [serviceFormData, setServiceFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    image: ""
  });

  const fetchData = async () => {
    if (!user || role !== "admin") return;

    try {
      setLoading(true);
      // Force token refresh to get latest claims
      const token = await user.getIdToken(true);
      const result = await getAdminStats(token);

      if (result.success && result.data && result.stats) {
        setStats(result.stats);
        setBookings(result.data.bookings);
        setTechnicians(result.data.technicians);
        setUsersList(result.data.users);
      }

      const logsRes = await getSystemLogs(token);
      if (logsRes.success) {
        setLogs(logsRes.logs || []);
      }

      const servicesRes = await getServicesForAdmin(token);
      if (servicesRes.success) {
        setServices(servicesRes.services || []);
      }

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
    if (!user) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      const result = await approveTechnician(techId, status, token);

      if (result.success) {
        setTechnicians(prev => prev.map(t => t.id === techId ? { ...t, status } : t));
        setSelectedTech(null);
        const activeTechs = technicians.map(t => t.id === techId ? { ...t, status } : t).filter((t: any) => t.status === "approved").length;
        setStats(prev => ({ ...prev, activeTechnicians: activeTechs }));
      } else {
        alert("Failed to update status: " + result.error);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignTechnician = async () => {
    if (!selectedBooking || !assignTechId || !user) return;
    setActionLoading(true);

    try {
      const token = await user.getIdToken();
      const result = await assignTechnician(selectedBooking.id, assignTechId, token);

      if (result.success) {
        const tech = technicians.find(t => t.id === assignTechId);
        setBookings(prev => prev.map(b => b.id === selectedBooking.id ? {
          ...b,
          technicianId: assignTechId,
          technicianName: tech?.fullName,
          status: "assigned"
        } : b));
        setSelectedBooking(null);
        setAssignTechId("");
      } else {
        alert("Failed to assign technician: " + result.error);
      }
    } catch (error) {
      console.error("Error assigning technician:", error);
      alert("Failed to assign technician");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    if (!user) return;
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    try {
      const token = await user.getIdToken();
      const result = await updateUserRole(userId, newRole, token);
      if (result.success) {
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      } else {
        alert("Failed to update role: " + result.error);
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role");
    }
  };

  const handleServiceSubmit = async () => {
    if (!user) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      const payload = {
        ...serviceFormData,
        price: Number(serviceFormData.price)
      };

      let result;
      if (editingService) {
        result = await updateService(editingService.id, payload, token);
      } else {
        result = await createService(payload, token);
      }

      if (result.success) {
        setIsServiceModalOpen(false);
        setEditingService(null);
        setServiceFormData({ title: "", category: "", price: "", description: "", image: "" });
        // Refresh services
        const servicesRes = await getServicesForAdmin(token);
        if (servicesRes.success) setServices(servicesRes.services || []);
      } else {
        alert("Failed to save service: " + result.error);
      }
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Failed to save service");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!user || !confirm("Are you sure you want to delete this service?")) return;
    try {
      const token = await user.getIdToken();
      const result = await deleteService(id, token);
      if (result.success) {
        setServices(prev => prev.filter(s => s.id !== id));
      } else {
        alert("Failed to delete service: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const openServiceModal = (service?: any) => {
    if (service) {
      setEditingService(service);
      setServiceFormData({
        title: service.title,
        category: service.category,
        price: service.price.toString(),
        description: service.description,
        image: service.image || ""
      });
    } else {
      setEditingService(null);
      setServiceFormData({ title: "", category: "", price: "", description: "", image: "" });
    }
    setIsServiceModalOpen(true);
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

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">ServiceBuddy</h1>
        <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
      </div>
      <nav className="mt-6 px-4 space-y-2">
        <Button variant={activeTab === "overview" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => { setActiveTab("overview"); setIsSidebarOpen(false); }}>
          <LayoutDashboard className="mr-2 h-4 w-4" /> Overview
        </Button>
        <Button variant={activeTab === "bookings" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => { setActiveTab("bookings"); setIsSidebarOpen(false); }}>
          <Calendar className="mr-2 h-4 w-4" /> Bookings
        </Button>
        <Button variant={activeTab === "services" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => { setActiveTab("services"); setIsSidebarOpen(false); }}>
          <Package className="mr-2 h-4 w-4" /> Services
        </Button>
        <Button variant={activeTab === "technicians" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => { setActiveTab("technicians"); setIsSidebarOpen(false); }}>
          <Briefcase className="mr-2 h-4 w-4" /> Technicians
        </Button>
        <Button variant={activeTab === "users" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => { setActiveTab("users"); setIsSidebarOpen(false); }}>
          <Users className="mr-2 h-4 w-4" /> Users
        </Button>
        <Button variant={activeTab === "logs" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => { setActiveTab("logs"); setIsSidebarOpen(false); }}>
          <Activity className="mr-2 h-4 w-4" /> System Logs
        </Button>
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex font-sans">
      {/* Desktop Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden lg:block fixed h-full z-10">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-8 lg:ml-64 w-full">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            {/* Mobile Sidebar Trigger */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden mr-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h2 className="text-2xl lg:text-3xl font-bold">Dashboard</h2>
          </div>
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
                <div className="space-y-4 overflow-x-auto">
                  {bookings.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No bookings found.</p>
                  ) : (
                    <div className="rounded-md border min-w-[600px]">
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

          <TabsContent value="services">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Services</CardTitle>
                  <CardDescription>Manage services offered on the platform</CardDescription>
                </div>
                <Button onClick={() => openServiceModal()}>
                  <Plus className="mr-2 h-4 w-4" /> Add Service
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map(service => (
                    <Card key={service.id} className="overflow-hidden">
                      <div className="h-32 bg-gray-100 relative">
                        {service.image ? (
                          <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <Package className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{service.title}</h3>
                            <p className="text-xs text-gray-500 capitalize">{service.category}</p>
                          </div>
                          <Badge variant="secondary">₹{service.price}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                          {service.description}
                        </p>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openServiceModal(service)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
                      <div key={tech.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors gap-4">
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
                        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
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
                <CardDescription>Manage user roles and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usersList.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No users found.</p>
                  ) : (
                    usersList.map((u) => (
                      <div key={u.id} className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg gap-4">
                        <div className="flex items-center space-x-4 w-full md:w-auto">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-semibold">{u.displayName || u.firstName + " " + u.lastName || "Unknown User"}</p>
                            <p className="text-sm text-gray-500">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
                          <div className="flex flex-col items-end">
                            <p className="text-xs text-gray-400 mb-1">
                              Joined: {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                            </p>
                            <Select defaultValue={u.role || "user"} onValueChange={(val) => handleRoleUpdate(u.id, val)}>
                              <SelectTrigger className="w-[120px] h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="technician">Technician</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>View system activity and audit trails</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logs.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No logs found.</p>
                  ) : (
                    <div className="rounded-md border overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-900 p-3 border-b text-xs font-medium text-gray-500 uppercase tracking-wider grid grid-cols-12 gap-2">
                        <div className="col-span-2">Time</div>
                        <div className="col-span-2">User</div>
                        <div className="col-span-2">Action</div>
                        <div className="col-span-6">Description</div>
                      </div>
                      <div className="divide-y divide-gray-200 dark:divide-gray-800 max-h-[500px] overflow-y-auto">
                        {logs.map((log) => (
                          <div key={log.id} className="p-3 text-sm grid grid-cols-12 gap-2 items-center hover:bg-gray-50 dark:hover:bg-gray-900/50">
                            <div className="col-span-2 text-gray-500 text-xs">
                              {new Date(log.timestamp).toLocaleString()}
                            </div>
                            <div className="col-span-2 font-medium truncate" title={log.userName}>
                              {log.userName || "System"}
                            </div>
                            <div className="col-span-2">
                              <Badge variant="outline" className="text-xs">
                                {log.action}
                              </Badge>
                            </div>
                            <div className="col-span-6 text-gray-600 dark:text-gray-300 truncate" title={log.description}>
                              {log.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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

      {/* Service Create/Edit Modal */}
      <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
            <DialogDescription>Fill in the details for the service.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" value={serviceFormData.title} onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Input id="category" value={serviceFormData.category} onChange={(e) => setServiceFormData({ ...serviceFormData, category: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price</Label>
              <Input id="price" type="number" value={serviceFormData.price} onChange={(e) => setServiceFormData({ ...serviceFormData, price: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">Image URL</Label>
              <Input id="image" value={serviceFormData.image} onChange={(e) => setServiceFormData({ ...serviceFormData, image: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" value={serviceFormData.description} onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsServiceModalOpen(false)}>Cancel</Button>
            <Button onClick={handleServiceSubmit} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}