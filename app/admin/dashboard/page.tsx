"use client";

import { useAdminData } from "@/hooks/useAdminData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Briefcase, Users, Loader2, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";

// Mock data for charts (replace with real data from API later)
const revenueData = [
    { name: "Jan", total: 15000 },
    { name: "Feb", total: 22000 },
    { name: "Mar", total: 18000 },
    { name: "Apr", total: 28000 },
    { name: "May", total: 24000 },
    { name: "Jun", total: 35000 },
];

const bookingsData = [
    { name: "Mon", bookings: 12 },
    { name: "Tue", bookings: 18 },
    { name: "Wed", bookings: 15 },
    { name: "Thu", bookings: 25 },
    { name: "Fri", bookings: 20 },
    { name: "Sat", bookings: 30 },
    { name: "Sun", bookings: 22 },
];

export default function AdminOverviewPage() {
    const { data, loading } = useAdminData();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const stats = data?.stats || { totalBookings: 0, totalRevenue: 0, activeTechnicians: 0, totalUsers: 0 };
    const bookings = data?.bookings || [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                    <p className="text-muted-foreground">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline">
                        <Link href="/admin/bookings">View All Bookings</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/admin/technicians">Manage Technicians</Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                            <h3 className="text-2xl font-bold">{stats.totalBookings}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex items-center space-x-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                            <h3 className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex items-center space-x-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full">
                            <Briefcase className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Technicians</p>
                            <h3 className="text-2xl font-bold">{stats.activeTechnicians}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex items-center space-x-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-full">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                            <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>Monthly revenue performance.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="name" className="text-xs text-muted-foreground" />
                                    <YAxis className="text-xs text-muted-foreground" tickFormatter={(value) => `₹${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#22c55e" fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Weekly Bookings</CardTitle>
                        <CardDescription>Number of bookings per day.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={bookingsData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="name" className="text-xs text-muted-foreground" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                                    />
                                    <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Bookings */}
                <Card className="col-span-4">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Bookings</CardTitle>
                            <CardDescription>Latest service requests from users.</CardDescription>
                        </div>
                        <Link href="/admin/bookings" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                            View All <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {bookings.slice(0, 5).map((booking) => (
                                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                            <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{booking.serviceName}</p>
                                            <p className="text-xs text-muted-foreground">{booking.userName}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm">₹{booking.amount}</p>
                                        <Badge variant={booking.status === "completed" ? "default" : "secondary"} className="mt-1 text-xs">
                                            {booking.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                            {bookings.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No bookings found.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Insights */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Insights</CardTitle>
                        <CardDescription>Performance metrics at a glance.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Revenue Growth</p>
                                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                                </div>
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">New Users</p>
                                    <p className="text-xs text-muted-foreground">+150 this week</p>
                                </div>
                                <Users className="h-4 w-4 text-blue-500" />
                            </div>
                            <div className="pt-4 border-t">
                                <Button className="w-full" variant="outline">Download Report</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
