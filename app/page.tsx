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
    { id: "home-cleaning", title: "Home Cleaning", icon: <HomeIcon className="h-8 w-8" />, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
    { id: "plumbing", title: "Plumbing", icon: <Droplets className="h-8 w-8" />, color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400" },
    { id: "electrical", title: "Electrical", icon: <Zap className="h-8 w-8" />, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" },
    { id: "appliance-repair", title: "Appliance", icon: <Wrench className="h-8 w-8" />, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
    { id: "beauty-salon", title: "Salon", icon: <Scissors className="h-8 w-8" />, color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" },
    { id: "gardening", title: "Gardening", icon: <Leaf className="h-8 w-8" />, color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
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
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Gradients & Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-[100px] animate-pulse" />
          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-bl from-cyan-400/20 to-blue-400/20 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Badge variant="secondary" className="mb-8 px-4 py-2 text-sm font-medium bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border border-gray-200 dark:border-gray-700 rounded-full">
                <Sparkles className="h-3 w-3 mr-2 text-yellow-500" />
                Trusted by 50,000+ Happy Customers
              </Badge>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white mb-8 leading-[1.1]">
                Home Services, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient-x">
                  Reimagined.
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                Experience the new standard of home care. Book trusted professionals for cleaning, repair, and grooming in seconds.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mb-16 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-2 border border-gray-100 dark:border-gray-800">
                  <Search className="absolute left-5 text-gray-400 h-6 w-6" />
                  <Input
                    type="text"
                    placeholder="What do you need help with?"
                    className="pl-14 pr-36 h-16 text-lg border-none shadow-none focus-visible:ring-0 bg-transparent placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button size="lg" className="absolute right-2 h-12 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-blue-500/25 transition-all">
                    Search
                  </Button>
                </div>
              </div>

              {/* Quick Categories */}
              <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                <span>Popular:</span>
                {["AC Service", "Sofa Cleaning", "Massage", "Electrician"].map((item) => (
                  <Link key={item} href={`/search?q=${item}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    {item}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Explore Categories</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">Everything you need for your home</p>
            </div>
            <Link href="/services" className="group text-blue-600 font-semibold flex items-center hover:text-blue-700 transition-colors">
              View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Link href={`/service/${category.id}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-none bg-white dark:bg-gray-800 hover:-translate-y-2 rounded-3xl overflow-hidden group">
                    <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center relative">
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${category.color.split(' ')[0]}`} />
                      <div className={`p-5 rounded-2xl mb-4 ${category.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                        {category.icon}
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{category.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Service Buddy?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We are committed to providing the best home service experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-900 rounded-3xl group hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="bg-blue-50 dark:bg-blue-900/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50/50 dark:bg-gray-900/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Customer Stories</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">See what our happy customers have to say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white dark:bg-gray-800 border-none shadow-lg rounded-3xl hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg leading-relaxed italic">
                    "Absolutely amazing service! The professional arrived on time and did a fantastic job. Highly recommended!"
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      SJ
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Sarah Johnson</h4>
                      <p className="text-sm text-gray-500">Home Cleaning</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Ready to simplify your life?</h2>
          <p className="text-blue-100 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium">
            Join thousands of satisfied customers who trust Service Buddy for their home needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 font-bold px-10 h-16 text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
              Book a Service
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold px-10 h-16 text-lg rounded-2xl backdrop-blur-sm hover:-translate-y-1 transition-all">
              Become a Professional
            </Button>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/30 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
      </section>
    </div>
  );
}
