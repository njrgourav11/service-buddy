"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getAdminStats } from "@/actions/admin";
import { Loader2, Users, Calendar, DollarSign, TrendingUp, Menu } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const result = await getAdminStats(token);
          if (result.success) {
            setStats(result.stats);
          }
        } catch (error) {
          console.error("Error fetching admin stats:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchStats();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) { // Add admin role check here in real app
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <Button asChild><Link href="/auth/login">Login</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center p-4 border-b bg-white dark:bg-gray-900 sticky top-0 z-10">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <AdminSidebar onLinkClick={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-bold">Admin Dashboard</h1>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r bg-white dark:bg-gray-900 min-h-screen sticky top-0 h-screen overflow-y-auto">
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white hidden md:block">Dashboard Overview</h1>
            <div className="flex space-x-2 ml-auto">
              <Button variant="outline">Export Data</Button>
              <Button>Settings</Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{stats?.totalRevenue?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">+19% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest service requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentBookings?.map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{booking.serviceName}</p>
                        <p className="text-sm text-gray-500">{booking.userName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{booking.amount}</p>
                        <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'} className="capitalize">
                          {booking.status?.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {!stats?.recentBookings?.length && <p className="text-center text-gray-500">No bookings yet</p>}
                </div>
              </CardContent>
            </Card>

            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Newest members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentUsers?.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {user.displayName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-medium">{user.displayName || "User"}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">{user.role || 'user'}</Badge>
                    </div>
                  ))}
                  {!stats?.recentUsers?.length && <p className="text-center text-gray-500">No users yet</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}