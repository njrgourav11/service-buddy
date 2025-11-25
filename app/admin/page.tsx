"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Briefcase,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || role !== "admin") return;

      try {
        // Fetch Bookings
        const bookingsSnap = await getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc"), limit(10)));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bookingsData = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        setBookings(bookingsData);

        // Fetch Technicians
        const techniciansSnap = await getDocs(collection(db, "technicians"));
        const techniciansData = techniciansSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTechnicians(techniciansData);

        // Calculate Stats
        const totalRevenue = bookingsData.reduce((acc: number, curr: { amount?: number }) => acc + (curr.amount || 0), 0);

        setStats({
          totalBookings: bookingsSnap.size, // In real app, use count() query
          totalRevenue,
          activeTechnicians: techniciansSnap.size,
          totalUsers: 150 // Mock for now
        });

      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [user, role, authLoading]);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden lg:block">
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
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
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
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Calendar className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{booking.serviceName}</p>
                          <p className="text-sm text-gray-500">{booking.address}</p>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Full bookings table would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technicians">
            <Card>
              <CardHeader>
                <CardTitle>Technician Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {technicians.map((tech) => (
                    <div key={tech.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{tech.firstName?.[0]}{tech.lastName?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{tech.firstName} {tech.lastName}</p>
                          <p className="text-sm text-gray-500">{tech.category} • {tech.experience} years exp</p>
                        </div>
                      </div>
                      <Badge variant={tech.status === "approved" ? "default" : "secondary"}>
                        {tech.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p>User management interface.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}