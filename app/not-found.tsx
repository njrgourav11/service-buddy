"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import {
  Home,
  Search,
  ArrowLeft,
  RefreshCw,
  MapPin,
  Phone,
  MessageCircle,
  AlertCircle
} from "lucide-react"

export default function NotFoundPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const popularServices = [
    { name: "Cleaning", icon: "🧹", href: "/services?category=Cleaning" },
    { name: "Plumbing", icon: "🔧", href: "/services?category=Plumbing" },
    { name: "Electrical", icon: "⚡", href: "/services?category=Electrical" },
    { name: "Car Wash", icon: "🚗", href: "/services?category=Car%20Services" },
    { name: "Beauty", icon: "💄", href: "/services?category=Beauty" },
    { name: "Gardening", icon: "🌱", href: "/services?category=Gardening" }
  ]

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true)
      setTimeout(() => {
        window.location.href = `/services?q=${encodeURIComponent(searchQuery)}`
      }, 800)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans selection:bg-blue-100 dark:selection:bg-blue-900">


      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Column: Text & Actions */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left space-y-8"
            >
              <div className="inline-flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-sm font-medium">
                <AlertCircle className="h-4 w-4 mr-2" />
                404 Error
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight">
                Page not <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">found</span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Oops! It seems the page you are looking for has vanished into thin air. Let's get you back on track.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/">
                  <Button size="lg" className="w-full sm:w-auto rounded-xl h-12 px-8 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25 transition-all">
                    <Home className="h-5 w-5 mr-2" />
                    Go Home
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.history.back()}
                  className="w-full sm:w-auto rounded-xl h-12 px-8 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Go Back
                </Button>
              </div>

              {/* Search Box */}
              <div className="max-w-md mx-auto lg:mx-0 pt-4">
                <div className="relative group">
                  <Input
                    placeholder="Search for services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-4 pr-12 h-14 rounded-2xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <Button
                    size="icon"
                    className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-blue-600 hover:text-white transition-colors"
                    onClick={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                  >
                    {isSearching ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Popular Services & Help */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Popular Services Card */}
              <Card className="border-none shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3 text-blue-600">✨</span>
                    Popular Services
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {popularServices.map((service, index) => (
                      <Link key={index} href={service.href}>
                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-105 transition-all duration-300 cursor-pointer text-center group border border-transparent hover:border-blue-200 dark:hover:border-blue-800">
                          <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">{service.icon}</div>
                          <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {service.name}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Help Card */}
              <Card className="border-none shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-3xl overflow-hidden">
                <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Need immediate help?</h3>
                    <p className="text-blue-100 text-sm">Our support team is available 24/7 to assist you.</p>
                  </div>
                  <div className="flex gap-3">
                    <Button size="icon" className="rounded-full bg-white/20 hover:bg-white/30 text-white border-none h-12 w-12">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button size="icon" className="rounded-full bg-white/20 hover:bg-white/30 text-white border-none h-12 w-12">
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                    <Link href="/support">
                      <Button size="icon" className="rounded-full bg-white text-blue-600 hover:bg-blue-50 border-none h-12 w-12 shadow-lg">
                        <MapPin className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}