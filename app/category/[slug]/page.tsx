"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
  categoryId: string
  description: string
  trending: boolean
  available: boolean
}

const allServices: Service[] = [
  {
    id: "home-cleaning-basic",
    title: "Basic Home Cleaning",
    icon: "🧹",
    price: "₹299",
    rating: 4.8,
    reviewCount: 1250,
    duration: "2-3 hours",
    category: "Home Cleaning",
    categoryId: "home-cleaning",
    description: "Professional deep cleaning services for your home",
    trending: true,
    available: true
  },
  {
    id: "plumbing-repair",
    title: "General Plumbing",
    icon: "🔧",
    price: "₹199",
    rating: 4.7,
    reviewCount: 890,
    duration: "1-2 hours",
    category: "Plumbing",
    categoryId: "plumbing",
    description: "Expert plumbing repairs and installations",
    trending: false,
    available: true
  },
  {
    id: "electrical-repair",
    title: "Electrical Checkup",
    icon: "⚡",
    price: "₹249",
    rating: 4.9,
    reviewCount: 756,
    duration: "1-3 hours",
    category: "Electrical",
    categoryId: "electrical",
    description: "Licensed electricians for all your electrical needs",
    trending: true,
    available: true
  },
  {
    id: "appliance-repair-ac",
    title: "AC Repair & Service",
    icon: "❄️",
    price: "₹349",
    rating: 4.6,
    reviewCount: 634,
    duration: "2-4 hours",
    category: "Appliance Repair",
    categoryId: "appliance-repair",
    description: "Repair and maintenance of air conditioners",
    trending: true,
    available: true
  },
  {
    id: "carpentry-repair",
    title: "Furniture Repair",
    icon: "🔨",
    price: "₹399",
    rating: 4.5,
    reviewCount: 567,
    duration: "2-6 hours",
    category: "Carpentry",
    categoryId: "carpentry",
    description: "General carpentry repairs and maintenance",
    trending: false,
    available: true
  },
  {
    id: "home-decor-consult",
    title: "Interior Design Consultation",
    icon: "🛋️",
    price: "₹999",
    rating: 4.8,
    reviewCount: 120,
    duration: "1-2 hours",
    category: "Home Decor",
    categoryId: "home-decor",
    description: "Expert advice on home decoration and layout",
    trending: true,
    available: true
  },
  {
    id: "painting-full",
    title: "Full Home Painting",
    icon: "🎨",
    price: "₹5000",
    rating: 4.8,
    reviewCount: 734,
    duration: "2-3 days",
    category: "Painting",
    categoryId: "painting",
    description: "Interior and exterior painting services",
    trending: true,
    available: true
  }
]

const categoryDescriptions = {
  "appliance-repair": {
    title: "Appliance Repair & Service",
    description: "Expert repair and maintenance for all your home appliances",
    icon: "🔧"
  },
  "electrical": {
    title: "Electrical Repair & Service",
    description: "Professional electrical services for your safety and convenience",
    icon: "⚡"
  },
  "plumbing": {
    title: "Plumbing Repair & Service",
    description: "Reliable plumbing solutions for your home",
    icon: "🚰"
  },
  "carpentry": {
    title: "Carpentry Repair & Service",
    description: "Skilled carpentry work for furniture and fixtures",
    icon: "🔨"
  },
  "home-decor": {
    title: "Home Decor & Installation",
    description: "Transform your space with our decor and installation services",
    icon: "🛋️"
  },
  "home-cleaning": {
    title: "Home Cleaning",
    description: "Professional cleaning services for a sparkling home",
    icon: "🧹"
  },
  "painting": {
    title: "Home Painting & Makeover",
    description: "Give your home a fresh look with our painting services",
    icon: "🎨"
  }
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"rating" | "price" | "popularity">("rating")

  const categoryData = categoryDescriptions[slug as keyof typeof categoryDescriptions]
  const categoryServices = allServices.filter(service =>
    service.categoryId === slug
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