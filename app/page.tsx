"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import {
  Home as HomeIcon,
  Wrench,
  Droplets,
  Zap,
  Scissors,
  Leaf,
  Shield,
  Clock,
  Star,
  Users,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const categories = [
    { id: "home-cleaning", title: "Home Cleaning", icon: HomeIcon, color: "from-blue-500 to-cyan-500" },
    { id: "plumbing", title: "Plumbing", icon: Droplets, color: "from-cyan-500 to-blue-500" },
    { id: "electrical", title: "Electrical", icon: Zap, color: "from-yellow-500 to-orange-500" },
    { id: "appliance-repair", title: "Appliance Repair", icon: Wrench, color: "from-orange-500 to-red-500" },
    { id: "beauty-salon", title: "Beauty & Salon", icon: Scissors, color: "from-pink-500 to-purple-500" },
    { id: "gardening", title: "Gardening", icon: Leaf, color: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Geometric Shapes */}
      <HeroGeometric
        badge="ServiceBuddy"
        title1="Your Trusted Partner for"
        title2="Home Services"
      />

      {/* Categories Section */}
      <section className="py-32 relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Our Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need for your home, all in one place
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link href={`/service/${category.id}`}>
                  <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-800">
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-gray-100 to-transparent dark:from-gray-800 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg relative z-10`}>
                      <category.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 relative z-10">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 relative z-10 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                      Professional {category.title} services at your doorstep
                    </p>

                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get your home services done in 3 simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 -translate-y-1/2 -z-10" />

            {[
              { title: "Book a Service", desc: "Choose from our wide range of services and select a convenient time.", icon: "1" },
              { title: "Expert Arrives", desc: "Our verified professional arrives at your doorstep on time.", icon: "2" },
              { title: "Job Done", desc: "Sit back and relax while we get the job done to your satisfaction.", icon: "3" }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 relative group hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - BentoGrid */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why ServiceBuddy?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We are committed to providing the best home service experience
            </p>
          </motion.div>

          <BentoGrid items={[
            {
              title: "Verified Professionals",
              meta: "5000+ experts",
              description: "Background-checked and trained professionals ready to serve you with excellence",
              icon: <Shield className="w-4 h-4 text-blue-500" />,
              status: "Verified",
              tags: ["Trusted", "Certified"],
              colSpan: 2,
              hasPersistentHover: true,
            },
            {
              title: "On-Time Service",
              meta: "98% on-time",
              description: "Punctual service delivery with real-time tracking and updates",
              icon: <Clock className="w-4 h-4 text-emerald-500" />,
              status: "Guaranteed",
              tags: ["Reliable", "Tracked"],
            },
            {
              title: "Quality Assured",
              meta: "4.8★ rating",
              description: "Consistently high-quality service with customer satisfaction guarantee",
              icon: <Star className="w-4 h-4 text-yellow-500" />,
              tags: ["Excellence", "Rated"],
              colSpan: 2,
            },
            {
              title: "24/7 Support",
              meta: "Always here",
              description: "Round-the-clock customer support for all your queries and concerns",
              icon: <Users className="w-4 h-4 text-purple-500" />,
              status: "Live",
              tags: ["Support", "Help"],
            },
          ]} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Ready to Transform Your Home?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
            Join thousands of satisfied customers who trust ServiceBuddy for their home needs
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 font-bold px-12 h-16 text-lg rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition-all">
              Book a Service Now
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-bold px-12 h-16 text-lg rounded-full backdrop-blur-sm hover:scale-105 transition-all">
              Become a Professional
            </Button>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
      </section>
    </div>
  );
}
