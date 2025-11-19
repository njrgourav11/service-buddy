"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Calendar,
  Clock,
  Star,
  TrendingUp,
  Award,
  MapPin,
  Phone,
  MessageCircle,
  ChevronRight,
  Home,
  Wrench,
  Car,
  Heart,
  Sparkles
} from "lucide-react"

const quickActions = [
  {
    title: "Book Service",
    description: "Schedule a new service",
    icon: <Calendar className="h-6 w-6" />,
    href: "/services",
    color: "bg-blue-500"
  },
  {
    title: "Rebook Favorite",
    description: "Quick rebooking",
    icon: <Star className="h-6 w-6" />,
    href: "/profile/bookings",
    color: "bg-yellow-500"
  },
  {
    title: "Emergency Help",
    description: "24/7 support",
    icon: <Phone className="h-6 w-6" />,
    href: "/support",
    color: "bg-red-500"
  },
  {
    title: "View Profile",
    description: "Manage account",
    icon: <Home className="h-6 w-6" />,
    href: "/profile",
    color: "bg-green-500"
  }
]

const upcomingBookings = [
  {
    id: "BK005",
    service: "Home Cleaning",
    icon: "🧹",
    date: "Today, 2:00 PM",
    provider: "Rajesh Kumar",
    status: "confirmed",
    address: "123 Main St, Mumbai"
  },
  {
    id: "BK006",
    service: "Electrical Repair",
    icon: "⚡",
    date: "Tomorrow, 10:00 AM",
    provider: "Amit Singh",
    status: "confirmed",
    address: "456 Oak Ave, Mumbai"
  }
]

const recentServices = [
  { name: "Home Cleaning", icon: "🧹", count: 12, color: "bg-blue-100 text-blue-800" },
  { name: "Plumbing", icon: "🔧", count: 8, color: "bg-green-100 text-green-800" },
  { name: "Electrical", icon: "⚡", count: 5, color: "bg-yellow-100 text-yellow-800" },
  { name: "Car Wash", icon: "🚗", count: 3, color: "bg-purple-100 text-purple-800" }
]

const stats = {
  totalBookings: 28,
  completedServices: 25,
  totalSpent: "₹8,450",
  averageRating: 4.8
}

export default function DashboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month")

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, John! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here&apos;s what&apos;s happening with your services today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Bookings
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.totalBookings}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">+12% from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Completed Services
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.completedServices}
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-green-500" />
                </div>
                <div className="mt-4">
                  <Progress value={(stats.completedServices / stats.totalBookings) * 100} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((stats.completedServices / stats.totalBookings) * 100)}% completion rate
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Spent
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.totalSpent}
                    </p>
                  </div>
                  <Sparkles className="h-8 w-8 text-purple-500" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">Saved ₹1,250 this year</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Average Rating
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.averageRating}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500 fill-current" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Based on {stats.completedServices} reviews
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <Link key={index} href={action.href}>
                        <div className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group">
                          <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                            {action.icon}
                          </div>
                          <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {action.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Upcoming Bookings</CardTitle>
                      <CardDescription>Your scheduled services</CardDescription>
                    </div>
                    <Link href="/profile/bookings">
                      <Button variant="outline" size="sm">
                        View All
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="text-3xl">{booking.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {booking.service}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {booking.date} • {booking.provider}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.address}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Most Used Services</CardTitle>
                  <CardDescription>Your favorite services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentServices.map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{service.icon}</div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {service.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {service.count} bookings
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className={service.color}>
                        {service.count}x
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Support Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Need Help?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Our support team is here to help you 24/7
                    </p>
                    <div className="space-y-2">
                      <Button className="w-full" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Support
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Live Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}