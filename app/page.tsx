"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Star,
  Shield,
  Clock,
  Users,
  Search,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Home as HomeIcon,
  Wrench,
  Zap,
  Droplets,
  Leaf,
  Scissors
} from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "home-cleaning", title: "Home Cleaning", icon: <HomeIcon className="h-8 w-8" />, color: "bg-blue-100 text-blue-600" },
    { id: "plumbing", title: "Plumbing", icon: <Droplets className="h-8 w-8" />, color: "bg-cyan-100 text-cyan-600" },
    { id: "electrical", title: "Electrical", icon: <Zap className="h-8 w-8" />, color: "bg-yellow-100 text-yellow-600" },
    { id: "appliance-repair", title: "Appliance", icon: <Wrench className="h-8 w-8" />, color: "bg-orange-100 text-orange-600" },
    { id: "beauty-salon", title: "Salon", icon: <Scissors className="h-8 w-8" />, color: "bg-pink-100 text-pink-600" },
    { id: "gardening", title: "Gardening", icon: <Leaf className="h-8 w-8" />, color: "bg-green-100 text-green-600" },
  ];

  const features = [
    {
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      title: "Verified Professionals",
      description: "Background checked & trained experts"
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "On-Time Service",
      description: "Punctual service delivery guaranteed"
    },
    {
      icon: <Star className="h-6 w-6 text-blue-600" />,
      title: "High Quality",
      description: "4.8+ average rating across services"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "24/7 Support",
      description: "Dedicated support for all your queries"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-10 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                ✨ Trusted by 50,000+ Happy Customers
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                Home Services, <br />
                <span className="text-blue-600 relative">
                  On Demand
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                Book trusted professionals for cleaning, repair, and grooming.
                Experience the new standard of home services.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mb-12">
                <div className="relative flex items-center bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-2 border border-gray-100 dark:border-gray-700">
                  <Search className="absolute left-4 text-gray-400 h-6 w-6" />
                  <Input
                    type="text"
                    placeholder="Search for 'AC Repair', 'Cleaning'..."
                    className="pl-12 pr-32 h-14 text-lg border-none shadow-none focus-visible:ring-0 bg-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button size="lg" className="absolute right-2 h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium">
                    Search
                  </Button>
                </div>
              </div>

              {/* Quick Categories */}
              <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
                <span>Popular:</span>
                {["AC Service", "Sofa Cleaning", "Massage", "Electrician"].map((item) => (
                  <Link key={item} href={`/search?q=${item}`} className="hover:text-blue-600 underline decoration-dotted underline-offset-4">
                    {item}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 dark:bg-blue-900/20 blur-3xl" />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-100/50 dark:bg-purple-900/20 blur-3xl" />
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Explore Categories</h2>
              <p className="text-gray-600 dark:text-gray-400">Everything you need for your home</p>
            </div>
            <Link href="/services" className="text-blue-600 font-semibold flex items-center hover:underline">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/service/${category.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-none bg-gray-50 dark:bg-gray-900 hover:-translate-y-1">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className={`p-4 rounded-full mb-4 ${category.color}`}>
                        {category.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{category.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Service Buddy?</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We are committed to providing the best home service experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-xl transition-shadow bg-white dark:bg-gray-800">
                <CardContent className="p-8 text-center">
                  <div className="bg-blue-50 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Customer Stories</h2>
            <p className="text-gray-600 dark:text-gray-400">See what our happy customers have to say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-gray-50 dark:bg-gray-900 border-none">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                    "Absolutely amazing service! The professional arrived on time and did a fantastic job. Highly recommended!"
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    <div>
                      <h4 className="font-bold text-sm">Sarah Johnson</h4>
                      <p className="text-xs text-gray-500">Home Cleaning</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to simplify your life?</h2>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Service Buddy for their home needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 h-14 text-lg">
              Book a Service
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700 font-bold px-8 h-14 text-lg">
              Become a Professional
            </Button>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
      </section>
    </div>
  );
}
