"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  Clock,
  Shield,
  CheckCircle,
  Phone,
  MessageCircle,
  Calendar,
  Users,
  Award,
  ThumbsUp
} from "lucide-react"

const serviceDetails = {
  "home-cleaning": {
    title: "Home Cleaning",
    description: "Professional deep cleaning services for your home",
    icon: "🧹",
    rating: 4.8,
    reviewCount: 1250,
    price: "₹299",
    duration: "2-3 hours",
    features: [
      "Deep cleaning of all rooms",
      "Bathroom and kitchen sanitization",
      "Floor mopping and vacuuming",
      "Window cleaning",
      "Eco-friendly products",
      "Trained professionals"
    ],
    packages: [
      {
        name: "Basic Clean",
        price: "₹299",
        duration: "2 hours",
        includes: ["Living room", "Bedroom", "Kitchen", "Bathroom"]
      },
      {
        name: "Deep Clean",
        price: "₹499",
        duration: "3 hours",
        includes: ["All Basic +", "Windows", "Appliances", "Balcony"]
      },
      {
        name: "Premium Clean",
        price: "₹699",
        duration: "4 hours",
        includes: ["All Deep +", "Carpet cleaning", "Upholstery", "Special care"]
      }
    ],
    reviews: [
      {
        name: "Priya Sharma",
        rating: 5,
        comment: "Excellent service! The cleaners were professional and thorough.",
        date: "2 days ago"
      },
      {
        name: "Rahul Kumar",
        rating: 4,
        comment: "Good service, arrived on time. Will book again.",
        date: "1 week ago"
      },
      {
        name: "Anita Patel",
        rating: 5,
        comment: "Very satisfied with the cleaning quality. Highly recommended!",
        date: "2 weeks ago"
      }
    ]
  },
  "plumbing": {
    title: "Plumbing Services",
    description: "Expert plumbing repairs and installations",
    icon: "🔧",
    rating: 4.7,
    reviewCount: 890,
    price: "₹199",
    duration: "1-2 hours",
    features: [
      "Leak repairs and fixes",
      "Pipe installation and replacement",
      "Drain cleaning",
      "Water heater services",
      "Emergency repairs",
      "Licensed plumbers"
    ],
    packages: [
      {
        name: "Leak Repair",
        price: "₹199",
        duration: "1 hour",
        includes: ["Leak detection", "Pipe repair", "Testing"]
      },
      {
        name: "Installation",
        price: "₹399",
        duration: "2 hours",
        includes: ["New fixtures", "Pipe installation", "Testing"]
      },
      {
        name: "Emergency Service",
        price: "₹599",
        duration: "Same day",
        includes: ["24/7 service", "Emergency repairs", "Priority booking"]
      }
    ],
    reviews: [
      {
        name: "Vikram Singh",
        rating: 5,
        comment: "Fixed my leaking faucet quickly. Very professional!",
        date: "3 days ago"
      },
      {
        name: "Meera Joshi",
        rating: 4,
        comment: "Good work, reasonable price. Would recommend.",
        date: "1 week ago"
      }
    ]
  },
  "electrical": {
    title: "Electrical Services",
    description: "Licensed electricians for all your electrical needs",
    icon: "⚡",
    rating: 4.9,
    reviewCount: 756,
    price: "₹249",
    duration: "1-3 hours",
    features: [
      "Wiring and rewiring",
      "Switch and outlet installation",
      "Lighting solutions",
      "Safety inspections",
      "Emergency electrical repairs",
      "Licensed electricians"
    ],
    packages: [
      {
        name: "Basic Repair",
        price: "₹249",
        duration: "1 hour",
        includes: ["Switch repair", "Basic wiring", "Testing"]
      },
      {
        name: "Installation",
        price: "₹449",
        duration: "2 hours",
        includes: ["New fixtures", "Wiring", "Safety check"]
      },
      {
        name: "System Upgrade",
        price: "₹799",
        duration: "4 hours",
        includes: ["Complete rewiring", "Panel upgrade", "Safety certification"]
      }
    ],
    reviews: [
      {
        name: "Amit Gupta",
        rating: 5,
        comment: "Professional electrician, fixed all issues quickly.",
        date: "1 day ago"
      }
    ]
  },
  "appliance-repair": {
    title: "Appliance Repair",
    description: "Repair and maintenance of household appliances",
    icon: "🔨",
    rating: 4.6,
    reviewCount: 634,
    price: "₹349",
    duration: "2-4 hours",
    features: [
      "AC and refrigerator repair",
      "Washing machine service",
      "Microwave repair",
      "Dishwasher maintenance",
      "Warranty on repairs",
      "Genuine spare parts"
    ],
    packages: [
      {
        name: "Basic Service",
        price: "₹349",
        duration: "2 hours",
        includes: ["Diagnosis", "Basic repair", "Testing"]
      }
    ],
    reviews: []
  },
  "pest-control": {
    title: "Pest Control",
    description: "Effective pest control and prevention services",
    icon: "🐛",
    rating: 4.7,
    reviewCount: 523,
    price: "₹399",
    duration: "2-3 hours",
    features: [
      "Termite treatment",
      "Cockroach control",
      "Rodent removal",
      "General pest spray",
      "Safe chemicals",
      "Follow-up service"
    ],
    packages: [
      {
        name: "General Treatment",
        price: "₹399",
        duration: "2 hours",
        includes: ["Inspection", "Treatment", "Prevention tips"]
      }
    ],
    reviews: []
  },
  "gardening": {
    title: "Gardening Services",
    description: "Professional gardening and landscaping services",
    icon: "🌱",
    rating: 4.5,
    reviewCount: 412,
    price: "₹199",
    duration: "3-5 hours",
    features: [
      "Lawn maintenance",
      "Plant care",
      "Garden design",
      "Tree pruning",
      "Soil treatment",
      "Seasonal planting"
    ],
    packages: [
      {
        name: "Basic Care",
        price: "₹199",
        duration: "3 hours",
        includes: ["Watering", "Pruning", "Weeding"]
      }
    ],
    reviews: []
  },
  "beauty-salon": {
    title: "Beauty & Salon",
    description: "Salon services at home - hair, beauty, and wellness",
    icon: "💄",
    rating: 4.8,
    reviewCount: 987,
    price: "₹499",
    duration: "1-2 hours",
    features: [
      "Hair cutting and styling",
      "Facial treatments",
      "Manicure and pedicure",
      "Makeup services",
      "Spa treatments",
      "Professional products"
    ],
    packages: [
      {
        name: "Basic Package",
        price: "₹499",
        duration: "1 hour",
        includes: ["Hair cut", "Basic facial", "Styling"]
      }
    ],
    reviews: []
  },
  "car-services": {
    title: "Car Services",
    description: "Car washing, detailing, and minor repairs",
    icon: "🚗",
    rating: 4.6,
    reviewCount: 845,
    price: "₹299",
    duration: "1-4 hours",
    features: [
      "Car washing",
      "Interior cleaning",
      "Waxing and polishing",
      "Minor repairs",
      "Tire service",
      "Mobile service"
    ],
    packages: [
      {
        name: "Basic Wash",
        price: "₹299",
        duration: "1 hour",
        includes: ["Exterior wash", "Interior vacuum", "Tire cleaning"]
      }
    ],
    reviews: []
  },
  "health-fitness": {
    title: "Health & Fitness",
    description: "Personal training and fitness services at home",
    icon: "💪",
    rating: 4.7,
    reviewCount: 678,
    price: "₹599",
    duration: "1-2 hours",
    features: [
      "Personal training",
      "Yoga sessions",
      "Nutrition guidance",
      "Fitness assessment",
      "Custom workout plans",
      "Progress tracking"
    ],
    packages: [
      {
        name: "Single Session",
        price: "₹599",
        duration: "1 hour",
        includes: ["Personal training", "Fitness assessment", "Workout plan"]
      }
    ],
    reviews: []
  }
}

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function ServiceDetailPage() {
  const params = useParams()
  const serviceId = params.id as string
  const service = serviceDetails[serviceId as keyof typeof serviceDetails]

  const [selectedPackage, setSelectedPackage] = useState(0)

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Service Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400">The service you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{service.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{service.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{service.rating}</span>
                      <span className="text-gray-500">({service.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">Starting {service.price}</div>
                    <div className="text-sm text-gray-500">{service.duration}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">What&apos;s included:</h3>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Why choose us:</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Shield className="h-4 w-4 text-blue-500 mr-2" />
                        Verified professionals
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-green-500 mr-2" />
                        On-time service
                      </div>
                      <div className="flex items-center text-sm">
                        <Award className="h-4 w-4 text-purple-500 mr-2" />
                        Quality guarantee
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Packages */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Package</CardTitle>
                <CardDescription>Select the package that best fits your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {service.packages.map((pkg, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPackage === index
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPackage(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{pkg.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{pkg.duration}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600">{pkg.price}</div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Includes: {pkg.includes.join(", ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {service.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {review.name.charAt(0)}
                          </div>
                          <span className="font-medium">{review.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">{review.comment}</p>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Book Your Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {service.packages[selectedPackage]?.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    {service.packages[selectedPackage]?.duration}
                  </div>
                </div>

                <Link href={`/book/${serviceId}?package=${selectedPackage}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>
                </Link>

                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Free cancellation
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    100% satisfaction guarantee
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verified professionals
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Guarantee</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Insurance Coverage</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      All services are covered by insurance
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Expert Team</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Trained and certified professionals
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <ThumbsUp className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Quality Assured</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      100% satisfaction or money back
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}