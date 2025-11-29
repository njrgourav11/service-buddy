"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Footer } from "@/components/footer"
import { useAuth } from "@/context/AuthContext"
import { getUserBookings } from "@/actions/booking"
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
  Loader2
} from "lucide-react"

interface Booking {
  id: string
  serviceName: string
  date: string
  time: string
  status: "upcoming" | "completed" | "cancelled" | "in-progress" | "pending_payment" | "confirmed" | "assigned"
  amount: number
  technicianId?: string
  address: string
  rating?: number
  review?: string
  [key: string]: any
}

const statusConfig: any = {
  upcoming: {
    label: "Upcoming",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    icon: <Clock className="h-4 w-4" />
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    icon: <CheckCircle className="h-4 w-4" />
  },
  assigned: {
    label: "Technician Assigned",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    icon: <CheckCircle className="h-4 w-4" />
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
  },
  pending_payment: {
    label: "Payment Pending",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    icon: <AlertCircle className="h-4 w-4" />
  }
}

export default function BookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  useEffect(() => {
    const fetchBookings = async () => {
      if (user) {
        try {
          const token = await user.getIdToken()
          const result = await getUserBookings(token)
          if (result.success && result.bookings) {
            setBookings(result.bookings as Booking[])
          }
        } catch (error) {
          console.error("Failed to fetch bookings", error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user])

  const filteredBookings = bookings.filter(booking => {
    if (filter === "all") return true
    if (filter === "upcoming") return ["upcoming", "confirmed", "assigned", "pending_payment"].includes(booking.status)
    return booking.status === filter
  }).sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "amount":
        return b.amount - a.amount
      case "status":
        return a.status.localeCompare(b.status)
      default:
        return 0
    }
  })

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || statusConfig.upcoming
    return (
      <Badge variant="secondary" className={config.color}>
        {config.icon}
        <span className="ml-1">{config.label}</span>
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">


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
              <TabsTrigger value="upcoming">Active</TabsTrigger>
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
                        <div className="text-4xl">🛠️</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {booking.serviceName}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400">
                                Booking #{booking.id.substring(0, 8).toUpperCase()}
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
                                <span className="font-medium mr-2">Technician:</span>
                                {booking.technicianId ? "Assigned" : "Pending Assignment"}
                              </div>
                              <div className="flex items-center text-sm font-semibold text-blue-600">
                                <span className="mr-2">Amount:</span>
                                ₹{booking.amount}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            {booking.status === "pending_payment" && (
                              <Link href={`/payment?bookingId=${booking.id}`}>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  Pay Now
                                </Button>
                              </Link>
                            )}
                            {(booking.status === "confirmed" || booking.status === "assigned") && (
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
                                Contact Technician
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
      </div>
      <Footer />
    </div>
  )
}