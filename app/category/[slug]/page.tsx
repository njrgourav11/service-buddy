"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import {
  Star,
  Clock,
  ArrowLeft,
  Grid,
  List
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

const categoryDescriptions = {
  "home-services": {
    title: "Home Services",
    description: "Professional services to keep your home clean, safe, and well-maintained",
    icon: "🏠"
  },
  "personal-care": {
    title: "Personal Care",
    description: "Beauty, wellness, and personal grooming services at your doorstep",
    icon: "💅"
  },
  "health": {
    title: "Health & Wellness",
    description: "Healthcare and fitness services for your well-being",
    icon: "❤️"
  },
  "automotive": {
    title: "Automotive",
    description: "Car care, maintenance, and repair services",
    icon: "🚗"
  },
  "outdoor-services": {
    title: "Outdoor Services",
    description: "Gardening, landscaping, and outdoor maintenance",
    icon: "🌳"
  },
  "events": {
    title: "Event Services",
    description: "Planning and coordination for special occasions",
    icon: "🎊"
  },
  "pet-care": {
    title: "Pet Care",
    description: "Professional care and services for your beloved pets",
    icon: "🐾"
  }
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"rating" | "price" | "popularity">("rating")

  const categoryData = categoryDescriptions[slug as keyof typeof categoryDescriptions]
  const categoryServices = allServices.filter(service =>
    service.category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slug
  )

  const sortedServices = [...categoryServices].sort((a, b) => {
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

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Category Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The category you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href="/services">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/services">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <div className="text-6xl mb-4">{categoryData.icon}</div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {categoryData.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {categoryData.description}
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              <span className="font-medium">{categoryServices.length} services available</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 dark:text-gray-400">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "rating" | "price" | "popularity")}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="rating">Rating</option>
              <option value="price">Price</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>

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

        {/* Services */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedServices.map((service, index) => (
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
            {sortedServices.map((service, index) => (
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

        {/* No Services */}
        {sortedServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No services available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This category doesn&apos;t have any services at the moment.
            </p>
            <Link href="/services">
              <Button>
                View All Services
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}