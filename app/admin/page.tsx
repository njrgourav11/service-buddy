"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Star,
  Settings,
  UserPlus,
  Wrench,
  MessageSquare,
  Shield
} from "lucide-react"

const stats = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12.5%",
    trend: "up",
    icon: <Users className="h-6 w-6" />,
    color: "text-blue-600"
  },
  {
    title: "Active Bookings",
    value: "1,429",
    change: "+8.2%",
    trend: "up",
    icon: <Calendar className="h-6 w-6" />,
    color: "text-green-600"
  },
  {
    title: "Revenue",
    value: "₹2,45,678",
    change: "+15.3%",
    trend: "up",
    icon: <DollarSign className="h-6 w-6" />,
    color: "text-purple-600"
  },
  {
    title: "Avg Rating",
    value: "4.8",
    change: "-0.1",
    trend: "down",
    icon: <Star className="h-6 w-6" />,
    color: "text-yellow-600"
  }
]

const recentBookings = [
  {
    id: "BK001",
    customer: "John Doe",
    service: "Home Cleaning",
    amount: "₹299",
    status: "completed",
    date: "2024-01-20",
    provider: "Rajesh Kumar"
  },
  {
    id: "BK002",
    customer: "Sarah Wilson",
    service: "Plumbing",
    amount: "₹199",
    status: "in-progress",
    date: "2024-01-20",
    provider: "Amit Singh"
  },
  {
    id: "BK003",
    customer: "Mike Johnson",
    service: "Electrical",
    amount: "₹249",
    status: "pending",
    date: "2024-01-21",
    provider: "Vikram Patel"
  },
  {
    id: "BK004",
    customer: "Emma Davis",
    service: "Car Wash",
    amount: "₹299",
    status: "cancelled",
    date: "2024-01-19",
    provider: "Suresh Reddy"
  }
]

const topServices = [
  { name: "Home Cleaning", bookings: 245, revenue: "₹73,455", growth: "+12%" },
  { name: "Plumbing", bookings: 189, revenue: "₹37,611", growth: "+8%" },
  { name: "Electrical", bookings: 156, revenue: "₹38,844", growth: "+15%" },
  { name: "Car Services", bookings: 134, revenue: "₹40,066", growth: "+5%" },
  { name: "Beauty Salon", bookings: 98, revenue: "₹48,902", growth: "+22%" }
]

const serviceProviders = [
  {
    id: "SP001",
    name: "Rajesh Kumar",
    service: "Home Cleaning",
    rating: 4.9,
    bookings: 45,
    status: "active",
    earnings: "₹13,455"
  },
  {
    id: "SP002",
    name: "Amit Singh",
    service: "Plumbing",
    rating: 4.7,
    bookings: 32,
    status: "active",
    earnings: "₹6,368"
  },
  {
    id: "SP003",
    name: "Vikram Patel",
    service: "Electrical",
    rating: 4.8,
    bookings: 28,
    status: "inactive",
    earnings: "₹6,972"
  }
]

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const [selectedTab, setSelectedTab] = useState("overview")

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      pending: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
    return (
      <Badge variant="secondary" className={statusConfig[status as keyof typeof statusConfig]}>
        {status.replace("-", " ")}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Monitor and manage your service platform
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                      {stat.change}
                    </span>
                    <span className="text-gray-500 ml-1">from last period</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest booking activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="text-lg">📋</div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {booking.customer}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {booking.service} • {booking.provider}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{booking.amount}</p>
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Services</CardTitle>
                  <CardDescription>Most popular services this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {service.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {service.bookings} bookings
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{service.revenue}</p>
                          <p className="text-sm text-green-600">{service.growth}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <UserPlus className="h-6 w-6 mb-2" />
                    Add Provider
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Wrench className="h-6 w-6 mb-2" />
                    Manage Services
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <MessageSquare className="h-6 w-6 mb-2" />
                    View Reports
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Shield className="h-6 w-6 mb-2" />
                    System Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>Manage and monitor all service bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">📋</div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {booking.customer} - {booking.service}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.date} • {booking.provider}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">{booking.amount}</span>
                        {getStatusBadge(booking.status)}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topServices.map((service, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {service.name}
                      <Badge variant="secondary">{service.growth}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Bookings</span>
                        <span className="font-medium">{service.bookings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
                        <span className="font-medium">{service.revenue}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      Manage Service
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Providers Tab */}
          <TabsContent value="providers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Providers</CardTitle>
                <CardDescription>Manage your network of service providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceProviders.map((provider) => (
                    <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {provider.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {provider.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {provider.service} • ⭐ {provider.rating}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">{provider.earnings}</p>
                          <p className="text-sm text-gray-500">{provider.bookings} bookings</p>
                        </div>
                        {getStatusBadge(provider.status)}
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}