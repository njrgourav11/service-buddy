
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

import HowItWorksCard from "@/components/ui/how-it-works-card";
import ServiceCard from "@/components/ui/service-card";
import SpotlightCTA from "@/components/ui/spotlight-cta";
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link href={`/service/${category.id}`}>
                  <ServiceCard
                    title={category.title}
                    description={`Professional ${category.title} services at your doorstep`}
                    icon={category.icon}
                    color={category.color}
                    className="h-full"
                  />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Hidden on mobile, visible on desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 -translate-y-1/2 -z-10 opacity-50" />

            {[
              {
                title: "Book a Service",
                desc: "Choose from our wide range of services and select a convenient time.",
                step: "1",
                image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=2072" // Person using tablet/checklist
              },
              {
                title: "Expert Arrives",
                desc: "Our verified professional arrives at your doorstep on time.",
                step: "2",
                image: "https://www.shutterstock.com/image-photo/technician-arriving-door-warm-professional-600nw-2612277443.jpg" // Professional worker
              },
              {
                title: "Job Done",
                desc: "Sit back and relax while we get the job done to your satisfaction.",
                step: "3",
                image: "https://media.istockphoto.com/id/1141206985/photo/working-day-is-over.jpg?s=612x612&w=0&k=20&c=-DmbVHTN0-ctDnwmy9RblTq8MeT0M-p_oHI0rTynGgQ=" // Relaxing on sofa (User provided)
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <HowItWorksCard
                  step={step.step}
                  title={step.title}
                  description={step.desc}
                  imageSrc={step.image}
                />
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
      </section >

      {/* CTA Section */}
      < section className="w-full" >
        <SpotlightCTA />
      </section >
    </div >
  );
}
