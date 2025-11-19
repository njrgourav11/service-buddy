"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Phone,
  MessageCircle,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Filter
} from "lucide-react"

interface Booking {
  id: string
  service: string
  icon: string
  date: string
  time: string
  status: "upcoming" | "completed" | "cancelled" | "in-progress"
  amount: string
  provider: string
  address: string
  rating?: number
  review?: string
}

const bookings: Booking[] = [
  {
    id: "BK001",
    service: "Home Cleaning",
    icon: "🧹",
    date: "2024-01-20",
    time: "2:00 PM",
    status: "upcoming",
    amount: "₹299",
    provider: "Rajesh Kumar",
    address: "123 Main St, Mumbai"
  },
  {
    id: "BK002",
    service: "Plumbing Repair",
    icon: "🔧",
    date: "2024-01-18",
    time: "10:00 AM",
    status: "completed",
    amount: "₹199",
    provider: "Amit Singh",
    address: "456 Oak Ave, Mumbai",
    rating: 5,
    review: "Excellent service! Fixed the leak quickly and professionally."
  },
  {
    id: "BK003",
    service: "Electrical Installation",
    icon: "⚡",
    date: "2024-01-15",
    time: "3:00 PM",
    status: "completed",
    amount: "₹449",
    provider: "Vikram Patel",
    address: "789 Pine St, Mumbai",
    rating: 4,
    review: "Good work, arrived on time. Minor delays but overall satisfied."
  },
  {
    id: "BK004",
    service: "Car Wash & Detailing",
    icon: "🚗",
    date: "2024-01-12",
    time: "11:00 AM",
    status: "cancelled",
    amount: "₹299",
    provider: "Suresh Reddy",
    address: "321 Elm St, Mumbai"
  },
  {
    id: "BK005",
    service: "AC Repair",
    icon: "❄️",
    date: "2024-01-10",
    time: "9:00 AM",
    status: "in-progress",
    amount: "₹599",
    provider: "Karan Sharma",
    address: "654 Maple Ave, Mumbai"
  }
]

const statusConfig = {
  upcoming: {
    label: "Upcoming",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    icon: <Clock className="h-4 w-4" />
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    icon: <CheckCircle className="h-4 w-4" />
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    icon: <XCircle className="h-4 w-4" />
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    icon: <AlertCircle className="h-4 w-4" />
  }
}

export default function BookingsPage() {
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const filteredBookings = bookings.filter(booking => {
    if (filter === "all") return true
    return booking.status === filter
  }).sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "amount":
        return parseInt(b.amount.replace("₹", "")) - parseInt(a.amount.replace("₹", ""))
      case "status":
        return a.status.localeCompare(b.status)
      default:
        return 0
    }
  })

  const getStatusBadge = (status: Booking["status"]) => {
    const config = statusConfig[status]
    return (
      <Badge variant="secondary" className={config.color}>
        {config.icon}
        <span className="ml-1">{config.label}</span>
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Bookings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your service bookings and track their status
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="amount">Sort by Amount</SelectItem>
                <SelectItem value="status">Sort by Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No bookings found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {filter === "all"
                    ? "You haven't booked any services yet."
                    : `No ${filter} bookings found.`
                  }
                </p>
                <Link href="/services">
                  <Button>
                    Browse Services
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">{booking.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {booking.service}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400">
                                Booking #{booking.id}
                              </p>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4 mr-2" />
                                {new Date(booking.date).toLocaleDateString()} at {booking.time}
                              </div>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <MapPin className="h-4 w-4 mr-2" />
                                {booking.address}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium mr-2">Provider:</span>
                                {booking.provider}
                              </div>
                              <div className="flex items-center text-sm font-semibold text-blue-600">
                                <span className="mr-2">Amount:</span>
                                {booking.amount}
                              </div>
                            </div>
                          </div>

                          {/* Rating and Review for completed bookings */}
                          {booking.status === "completed" && booking.rating && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < booking.rating!
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium">
                                  {booking.rating}/5
                                </span>
                              </div>
                              {booking.review && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                  &quot;{booking.review}&quot;
                                </p>
                              )}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            {booking.status === "upcoming" && (
                              <>
                                <Button variant="outline" size="sm">
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Reschedule
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                  Cancel Booking
                                </Button>
                              </>
                            )}
                            {booking.status === "in-progress" && (
                              <Button variant="outline" size="sm">
                                <Phone className="h-4 w-4 mr-2" />
                                Contact Provider
                              </Button>
                            )}
                            {booking.status === "completed" && !booking.rating && (
                              <Button variant="outline" size="sm">
                                <Star className="h-4 w-4 mr-2" />
                                Rate Service
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Support
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {bookings.filter(b => b.status === "upcoming").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === "completed").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {bookings.filter(b => b.status === "in-progress").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {bookings.filter(b => b.status === "cancelled").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Cancelled</div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}