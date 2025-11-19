"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Calendar,
  Star,
  Settings,
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  Edit,
  Camera,
  MapPin,
  Phone,
  Mail
} from "lucide-react"

import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    location: "Berhampur, Odisha",
    joinDate: "January 2024",
    avatar: ""
  })

  const bookingHistory = [
    {
      id: "BK001",
      service: "Home Cleaning",
      date: "2024-01-15",
      status: "Completed",
      amount: "₹299",
      provider: "Rajesh Kumar"
    },
    {
      id: "BK002",
      service: "Plumbing Repair",
      date: "2024-01-10",
      status: "Completed",
      amount: "₹199",
      provider: "Amit Singh"
    },
    {
      id: "BK003",
      service: "AC Service",
      date: "2024-01-05",
      status: "Upcoming",
      amount: "₹399",
      provider: "Vikram Patel"
    }
  ]

  const handleSave = () => {
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-blue-100 dark:ring-blue-900">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 p-0 bg-white dark:bg-gray-800 shadow-lg"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</h2>
                  <p className="text-gray-500 text-sm mb-3">Member since {user.joinDate}</p>
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">4.8</span>
                      <span className="text-xs text-gray-500 ml-1">(12 reviews)</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">12</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Bookings</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">₹2.8K</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Spent</div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <nav className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Calendar className="h-4 w-4 mr-3" />
                    My Bookings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start hover:bg-gray-50 dark:hover:bg-gray-700">
                    <CreditCard className="h-4 w-4 mr-3" />
                    Payment Methods
                  </Button>
                  <Button variant="ghost" className="w-full justify-start hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Bell className="h-4 w-4 mr-3" />
                    Notifications
                  </Button>
                  <Button variant="ghost" className="w-full justify-start hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start hover:bg-gray-50 dark:hover:bg-gray-700">
                    <HelpCircle className="h-4 w-4 mr-3" />
                    Help & Support
                  </Button>
                  <Separator className="my-4" />
                  <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl text-gray-900 dark:text-white">Profile Information</CardTitle>
                      <CardDescription>Manage your personal details and preferences</CardDescription>
                    </div>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className={isEditing ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center text-sm font-medium">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={user.name}
                        onChange={(e) => setUser({...user, name: e.target.value})}
                        disabled={!isEditing}
                        className={isEditing ? "border-blue-300 focus:border-blue-500" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center text-sm font-medium">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({...user, email: e.target.value})}
                        disabled={!isEditing}
                        className={isEditing ? "border-blue-300 focus:border-blue-500" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center text-sm font-medium">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={user.phone}
                        onChange={(e) => setUser({...user, phone: e.target.value})}
                        disabled={!isEditing}
                        className={isEditing ? "border-blue-300 focus:border-blue-500" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center text-sm font-medium">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={user.location}
                        onChange={(e) => setUser({...user, location: e.target.value})}
                        disabled={!isEditing}
                        className={isEditing ? "border-blue-300 focus:border-blue-500" : ""}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">Recent Bookings</CardTitle>
                  <CardDescription>Your service booking history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bookingHistory.map((booking, index) => (
                      <motion.div 
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-md transition-all duration-200 bg-white/50 dark:bg-gray-800/50"
                      >
                        <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{booking.service}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {booking.date} • {booking.provider}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right">
                          <div className="font-bold text-lg text-gray-900 dark:text-white">{booking.amount}</div>
                          <Badge
                            variant={booking.status === 'Completed' ? 'default' : 'secondary'}
                            className={booking.status === 'Completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                              : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-300">
                      View All Bookings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
            >
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2">12</div>
                  <div className="text-blue-100">Total Bookings</div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2">₹2,847</div>
                  <div className="text-green-100">Total Spent</div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white sm:col-span-2 lg:col-span-1">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2">4.8</div>
                  <div className="text-purple-100">Average Rating</div>
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