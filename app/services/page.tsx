"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Search,
  Star,
  Clock,
  MapPin,
  Filter,
  Grid,
  List,
  SlidersHorizontal
} from "lucide-react"

interface Service {
  id: string
  title: string
  icon: string
  price: string
  rating: number
  reviewCount: number
  duration: string
  category: string
  description: string
  trending: boolean
  available: boolean
}

const allServices: Service[] = [
  {
    id: "home-cleaning",
    title: "Home Cleaning",
    icon: "🧹",
    price: "₹299",
    rating: 4.8,
    reviewCount: 1250,
    duration: "2-3 hours",
    category: "Home Services",
    description: "Professional deep cleaning services for your home",
    trending: true,
    available: true
  },
  {
    id: "plumbing",
    title: "Plumbing",
    icon: "🔧",
    price: "₹199",
    rating: 4.7,
    reviewCount: 890,
    duration: "1-2 hours",
    category: "Home Services",
    description: "Expert plumbing repairs and installations",
    trending: false,
    available: true
  },
  {
    id: "electrical",
    title: "Electrical",
    icon: "⚡",
    price: "₹249",
    rating: 4.9,
    reviewCount: 756,
    duration: "1-3 hours",
    category: "Home Services",
    description: "Licensed electricians for all your electrical needs",
    trending: true,
    available: true
  },
  {
    id: "appliance-repair",
    title: "Appliance Repair",
    icon: "🔨",
    price: "₹349",
    rating: 4.6,
    reviewCount: 634,
    duration: "2-4 hours",
    category: "Home Services",
    description: "Repair and maintenance of household appliances",
    trending: false,
    available: true
  },
  {
    id: "pest-control",
    title: "Pest Control",
    icon: "🐛",
    price: "₹399",
    rating: 4.7,
    reviewCount: 523,
    duration: "2-3 hours",
    category: "Home Services",
    description: "Effective pest control and prevention services",
    trending: false,
    available: true
  },
  {
    id: "gardening",
    title: "Gardening",
    icon: "🌱",
    price: "₹199",
    rating: 4.5,
    reviewCount: 412,
    duration: "3-5 hours",
    category: "Outdoor Services",
    description: "Professional gardening and landscaping services",
    trending: false,
    available: true
  },
  {
    id: "beauty-salon",
    title: "Beauty & Salon",
    icon: "💄",
    price: "₹499",
    rating: 4.8,
    reviewCount: 987,
    duration: "1-2 hours",
    category: "Personal Care",
    description: "Salon services at home - hair, beauty, and wellness",
    trending: true,
    available: true
  },
  {
    id: "car-services",
    title: "Car Services",
    icon: "🚗",
    price: "₹299",
    rating: 4.6,
    reviewCount: 845,
    duration: "1-4 hours",
    category: "Automotive",
    description: "Car washing, detailing, and minor repairs",
    trending: false,
    available: true
  },
  {
    id: "health-fitness",
    title: "Health & Fitness",
    icon: "💪",
    price: "₹599",
    rating: 4.7,
    reviewCount: 678,
    duration: "1-2 hours",
    category: "Health",
    description: "Personal training and fitness services at home",
    trending: false,
    available: true
  },
  {
    id: "home-repair",
    title: "Home Repair",
    icon: "🔨",
    price: "₹399",
    rating: 4.5,
    reviewCount: 567,
    duration: "2-6 hours",
    category: "Home Services",
    description: "General home repairs and maintenance",
    trending: false,
    available: true
  },
  {
    id: "painting",
    title: "Painting",
    icon: "🎨",
    price: "₹449",
    rating: 4.8,
    reviewCount: 734,
    duration: "4-8 hours",
    category: "Home Services",
    description: "Interior and exterior painting services",
    trending: true,
    available: true
  },
  {
    id: "security-systems",
    title: "Security Systems",
    icon: "🔒",
    price: "₹699",
    rating: 4.9,
    reviewCount: 456,
    duration: "2-4 hours",
    category: "Home Services",
    description: "Installation and maintenance of security systems",
    trending: false,
    available: true
  },
  {
    id: "event-services",
    title: "Event Services",
    icon: "🎉",
    price: "₹899",
    rating: 4.7,
    reviewCount: 345,
    duration: "4-12 hours",
    category: "Events",
    description: "Event planning and coordination services",
    trending: false,
    available: true
  },
  {
    id: "pet-services",
    title: "Pet Services",
    icon: "🐕",
    price: "₹249",
    rating: 4.6,
    reviewCount: 678,
    duration: "1-2 hours",
    category: "Pet Care",
    description: "Pet grooming, walking, and care services",
    trending: true,
    available: true
  },
  {
    id: "elderly-care",
    title: "Elderly Care",
    icon: "👴",
    price: "₹399",
    rating: 4.8,
    reviewCount: 234,
    duration: "2-4 hours",
    category: "Health",
    description: "Compassionate care services for elderly",
    trending: false,
    available: true
  }
]

const categories = ["All", "Home Services", "Personal Care", "Health", "Automotive", "Outdoor Services", "Events", "Pet Care"]

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"rating" | "price" | "popularity">("rating")

  const filteredServices = allServices
    .filter(service =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(service => selectedCategory === "All" || service.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "price":
          return parseInt(a.price.replace("₹", "")) - parseInt(b.price.replace("₹", ""))
        case "popularity":
          return b.reviewCount - a.reviewCount
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              All Services
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Find the perfect service for your needs
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg rounded-full border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "rating" | "price" | "popularity")}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="rating">Sort by Rating</option>
              <option value="price">Sort by Price</option>
              <option value="popularity">Sort by Popularity</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredServices.length} services
          </p>
        </div>

        {/* Services Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/service/${service.id}`}>
                  <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-full">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">{service.icon}</div>
                      <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{service.rating}</span>
                        <span className="text-gray-500 text-sm">({service.reviewCount})</span>
                      </div>

                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{service.duration}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-blue-600">
                          Starting {service.price}
                        </div>
                        {service.trending && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                            Trending
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/service/${service.id}`}>
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-6">
                        <div className="text-4xl">{service.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-xl mb-2">{service.title}</h3>
                              <p className="text-gray-600 dark:text-gray-400 mb-3">
                                {service.description}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span>{service.rating} ({service.reviewCount} reviews)</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{service.duration}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600 mb-2">
                                Starting {service.price}
                              </div>
                              {service.trending && (
                                <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                  Trending
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No services found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}