"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/navigation";
import {
  Star,
  Shield,
  Clock,
  Users,
  Phone,
  Mail,
  MapPin,
  Play,
  ArrowRight,
  Search,
  Sparkles,
  Award,
  TrendingUp,
  Quote,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Calendar
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  icon: string;
  price: string;
  rating: number;
  trending: boolean;
}

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const serviceCategories: Service[] = [
    { id: "home-cleaning", title: "Home Cleaning", icon: "🧹", price: "₹299", rating: 4.8, trending: true },
    { id: "plumbing", title: "Plumbing", icon: "🔧", price: "₹199", rating: 4.7, trending: false },
    { id: "electrical", title: "Electrical", icon: "⚡", price: "₹249", rating: 4.9, trending: true },
    { id: "appliance-repair", title: "Appliance Repair", icon: "🔨", price: "₹349", rating: 4.6, trending: false },
    { id: "pest-control", title: "Pest Control", icon: "🐛", price: "₹399", rating: 4.7, trending: false },
    { id: "gardening", title: "Gardening", icon: "🌱", price: "₹199", rating: 4.5, trending: false },
    { id: "beauty-salon", title: "Beauty & Salon", icon: "💄", price: "₹499", rating: 4.8, trending: true },
    { id: "car-services", title: "Car Services", icon: "🚗", price: "₹299", rating: 4.6, trending: false },
    { id: "health-fitness", title: "Health & Fitness", icon: "💪", price: "₹599", rating: 4.7, trending: false },
    { id: "home-repair", title: "Home Repair", icon: "🔨", price: "₹399", rating: 4.5, trending: false },
    { id: "painting", title: "Painting", icon: "🎨", price: "₹449", rating: 4.8, trending: true },
    { id: "security-systems", title: "Security Systems", icon: "🔒", price: "₹699", rating: 4.9, trending: false },
    { id: "event-services", title: "Event Services", icon: "🎉", price: "₹899", rating: 4.7, trending: false },
    { id: "pet-services", title: "Pet Services", icon: "🐕", price: "₹249", rating: 4.6, trending: true },
    { id: "elderly-care", title: "Elderly Care", icon: "👴", price: "₹399", rating: 4.8, trending: false },
    { id: "tutoring", title: "Tutoring", icon: "📚", price: "₹299", rating: 4.7, trending: false }
  ];

  const trendingServices = serviceCategories.filter(service => service.trending);

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Verified Professionals",
      description: "All our service providers are background checked and certified"
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "On-Time Service",
      description: "Punctual service delivery with real-time tracking"
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      title: "Quality Guarantee",
      description: "100% satisfaction guarantee on all services"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Customer Support",
      description: "24/7 customer support for all your needs"
    },
    {
      icon: <Award className="h-8 w-8 text-orange-600" />,
      title: "Background Checks",
      description: "Comprehensive background verification for all professionals"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-indigo-600" />,
      title: "Fixed Pricing",
      description: "Transparent pricing with no hidden charges"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      comment: "Excellent service! The cleaners were professional and thorough. Highly recommended!",
      avatar: "PS",
      service: "Home Cleaning"
    },
    {
      name: "Rahul Kumar",
      location: "Delhi",
      rating: 5,
      comment: "Great experience with Service Buddy. On-time service and quality work.",
      avatar: "RK",
      service: "Plumbing"
    },
    {
      name: "Anita Patel",
      location: "Bangalore",
      rating: 4,
      comment: "Very satisfied with the service. Will definitely book again.",
      avatar: "AP",
      service: "Electrical"
    },
    {
      name: "Vikram Singh",
      location: "Chennai",
      rating: 5,
      comment: "Outstanding customer service and professional technicians.",
      avatar: "VS",
      service: "AC Repair"
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Choose Service",
      description: "Browse through our wide range of services and select what you need",
      icon: <Search className="h-8 w-8" />
    },
    {
      step: 2,
      title: "Book & Schedule",
      description: "Pick your preferred date and time, enter your details",
      icon: <Calendar className="h-8 w-8" />
    },
    {
      step: 3,
      title: "Get Service",
      description: "Our verified professional arrives at your doorstep",
      icon: <Users className="h-8 w-8" />
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-6 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 animate-pulse">
              🏆 Trusted by 10,000+ customers
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Your Home, Our <span className="text-blue-600 dark:text-blue-400">Expertise</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Get professional home services from verified experts. From cleaning to repairs,
              we make maintaining your home effortless and affordable.
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-2xl border-0">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="What service do you need?"
                        className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="lg" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Search className="h-5 w-5 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Popular:</span>
                  {["Cleaning", "Plumbing", "Electrical", "AC Repair"].map((service) => (
                    <Badge key={service} variant="secondary" className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <Play className="h-5 w-5 mr-2" />
              Book a Service
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
              <ArrowRight className="h-5 w-5 mr-2" />
              View All Services
            </Button>
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-green-200 dark:bg-green-800 rounded-full opacity-20 animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-bounce delay-2000"></div>
      </section>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-6 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 animate-pulse">
              🏆 Trusted by 10,000+ customers
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Your Home, Our <span className="text-blue-600 dark:text-blue-400">Expertise</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Get professional home services from verified experts. From cleaning to repairs,
              we make maintaining your home effortless and affordable.
            </p>
          </div>



          {/* Quick Actions */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
            {serviceCategories.slice(0, 4).map((service: Service) => (
              <Link key={service.id} href={`/service/${service.id}`}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{service.icon}</div>
                    <h3 className="font-semibold text-sm">{service.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Starting {service.price}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-4 duration-1000 delay-300">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
              <Play className="h-5 w-5 mr-2" />
              Book a Service
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
              <ArrowRight className="h-5 w-5 mr-2" />
              View All Services
            </Button>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-green-200 dark:bg-green-800 rounded-full opacity-20 animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-bounce delay-2000"></div>
      </section>

      {/* Service Categories Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive home services tailored to your needs
            </p>
          </motion.div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {serviceCategories.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <Link href={`/service/${service.id}`}>
                  <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white dark:bg-gray-800 cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                      <h3 className="font-semibold text-sm mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{service.title}</h3>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Starting {service.price}</div>
                      <div className="flex items-center justify-center text-xs text-gray-500">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {service.rating}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/services">
              <Button size="lg" variant="outline" className="border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                View All Services
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trending Services Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trending Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Most popular services chosen by our customers
            </p>
          </motion.div>
          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-4 sm:space-x-6 min-w-max">
              {trendingServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="w-72 sm:w-80 flex-shrink-0"
                >
                  <Link href={`/service/${service.id}`}>
                    <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white dark:bg-gray-800 cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="text-4xl">{service.icon}</div>
                          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{service.price}</div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                            {service.rating}
                          </div>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          Book Now
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get professional services in just three simple steps
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="text-blue-600 dark:text-blue-400">
                      {step.icon}
                    </div>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-blue-200 dark:bg-blue-800 transform -translate-x-10"></div>
                  )}
                </div>
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Service Buddy?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the difference with our commitment to excellence
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <Card className="border-0 shadow-md bg-white dark:bg-gray-800 h-full group-hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Don&apos;t just take our word for it - hear from our satisfied customers
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <Card className="border-0 shadow-xl bg-white dark:bg-gray-800 mx-auto max-w-2xl">
                  <CardContent className="p-8">
                    <Quote className="h-12 w-12 text-blue-200 dark:text-blue-800 mx-auto mb-6" />
                    <p className="text-xl text-gray-600 dark:text-gray-400 italic mb-6">
                      &ldquo;{testimonials[currentTestimonial].comment}&rdquo;
                    </p>
                    <div className="flex items-center justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonials[currentTestimonial].rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {testimonials[currentTestimonial].avatar}
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{testimonials[currentTestimonial].name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{testimonials[currentTestimonial].location}</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">{testimonials[currentTestimonial].service}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Navigation */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-blue-100 mb-8"
          >
            Book your service today and experience hassle-free home maintenance
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
              📱 Download App
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300">
              📞 Call Now
            </Button>
          </motion.div>
        </div>
        {/* Background decoration */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-1000"></div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <Link href="/" className="text-2xl font-bold text-blue-400 mb-4 inline-block">
                  Service Buddy
                </Link>
                <p className="text-gray-300 mb-6 max-w-md">
                  Your trusted partner for all home services. Making home maintenance simple and reliable with verified professionals.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    4.8/5 Rating
                  </Badge>
                  <Badge variant="secondary" className="bg-green-600 text-white">
                    ✓ Verified
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-600 text-white">
                    🏆 Award Winner
                  </Badge>
                </div>
                {/* Social Links */}
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Youtube className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Services */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Services</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><Link href="/services/cleaning" className="hover:text-white transition-colors">Home Cleaning</Link></li>
                  <li><Link href="/services/plumbing" className="hover:text-white transition-colors">Plumbing</Link></li>
                  <li><Link href="/services/electrical" className="hover:text-white transition-colors">Electrical</Link></li>
                  <li><Link href="/services/appliance-repair" className="hover:text-white transition-colors">Appliance Repair</Link></li>
                  <li><Link href="/services" className="hover:text-white transition-colors">View All Services</Link></li>
                </ul>
              </div>

              {/* Support & Company */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-300 mb-6">
                  <li><Link href="/support" className="hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link href="/profile" className="hover:text-white transition-colors">My Account</Link></li>
                  <li><a href="#" className="hover:text-white transition-colors">Track Booking</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                </ul>

                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Info Bar */}
          <div className="border-t border-gray-800 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start">
                <Phone className="h-5 w-5 mr-3 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Call us</p>
                  <p className="font-semibold">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <Mail className="h-5 w-5 mr-3 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Email us</p>
                  <p className="font-semibold">hello@servicebuddy.com</p>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <MapPin className="h-5 w-5 mr-3 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Visit us</p>
                  <p className="font-semibold">Berhampur, Odisha</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-800" />

          {/* Bottom Footer */}
          <div className="py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left text-gray-400 mb-4 md:mb-0">
                <p>&copy; 2024 Service Buddy. All rights reserved.</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm text-gray-400">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
                <Link href="/support" className="hover:text-white transition-colors">Support</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
