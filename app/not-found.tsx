"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import {
  Home,
  Search,
  ArrowLeft,
  RefreshCw,
  MapPin,
  Phone,
  MessageCircle
} from "lucide-react"

export default function NotFoundPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const popularServices = [
    { name: "Home Cleaning", icon: "🧹", href: "/service/home-cleaning" },
    { name: "Plumbing", icon: "🔧", href: "/service/plumbing" },
    { name: "Electrical", icon: "⚡", href: "/service/electrical" },
    { name: "Car Wash", icon: "🚗", href: "/service/car-services" },
    { name: "Beauty Salon", icon: "💄", href: "/service/beauty-salon" },
    { name: "Gardening", icon: "🌱", href: "/service/gardening" }
  ]

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true)
      // Simulate search
      setTimeout(() => {
        window.location.href = `/services?q=${encodeURIComponent(searchQuery)}`
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          {/* Main 404 Content */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="text-8xl mb-6">🤖</div>
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              The page you&apos;re looking for seems to have taken a day off. Don&apos;t worry,
              let&apos;s get you back to finding the perfect service for your needs.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/">
                <Button size="lg" className="w-full sm:w-auto">
                  <Home className="h-5 w-5 mr-2" />
                  Go Home
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Go Back
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Try Again
              </Button>
            </div>
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Search for Services
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Maybe what you&apos;re looking for is just a search away
                  </p>
                </div>

                <div className="max-w-md mx-auto">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search for services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="flex-1"
                    />
                    <Button
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
              </CardContent>
            </Card>
          </motion.div>

          {/* Popular Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Popular Services
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Explore our most popular services
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {popularServices.map((service, index) => (
                    <Link key={index} href={service.href}>
                      <div className="p-4 border rounded-lg hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer text-center">
                        <div className="text-3xl mb-2">{service.icon}</div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {service.name}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <Link href="/services">
                    <Button variant="outline">
                      View All Services
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Need Help?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our support team is here to help you find what you need
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold mb-1">Call Us</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      +91 1800-XXX-XXXX
                    </p>
                    <p className="text-xs text-gray-500">24/7 Support</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-1">Live Chat</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Available on website
                    </p>
                    <p className="text-xs text-gray-500">Mon-Sun: 8AM-10PM</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold mb-1">Visit Support</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      support@servicebuddy.com
                    </p>
                    <p className="text-xs text-gray-500">Response within 24h</p>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <Link href="/support">
                    <Button>
                      Go to Support Center
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Fun Facts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                <span>💡 Fun fact: We serve over 10,000 customers daily!</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}