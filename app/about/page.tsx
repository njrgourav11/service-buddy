"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Footer } from "@/components/footer"
import { Users, Award, TrendingUp, Heart, Shield, Clock } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
    const stats = [
        { label: "Happy Customers", value: "100k+", icon: <Heart className="h-6 w-6 text-red-500" /> },
        { label: "Verified Partners", value: "10k+", icon: <Shield className="h-6 w-6 text-blue-500" /> },
        { label: "Cities Served", value: "50+", icon: <MapIcon className="h-6 w-6 text-green-500" /> },
        { label: "Services Completed", value: "500k+", icon: <CheckCircle className="h-6 w-6 text-purple-500" /> },
    ]

    const values = [
        {
            title: "Trust & Safety",
            description: "Every service provider is thoroughly background checked and verified.",
            icon: <Shield className="h-8 w-8 text-blue-600" />
        },
        {
            title: "Quality Assurance",
            description: "We maintain high standards through rigorous training and monitoring.",
            icon: <Award className="h-8 w-8 text-yellow-500" />
        },
        {
            title: "Customer First",
            description: "Your satisfaction is our top priority. We're here to help 24/7.",
            icon: <Users className="h-8 w-8 text-green-500" />
        },
        {
            title: "Reliability",
            description: "On-time service delivery with real-time tracking and updates.",
            icon: <Clock className="h-8 w-8 text-purple-500" />
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">


            {/* Hero Section */}
            <div className="relative bg-blue-600 dark:bg-blue-900 text-white py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        Empowering Local Professionals
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto"
                    >
                        Building the most trusted platform for home services, one booking at a time.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-24 mb-16 relative z-20">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                        >
                            <Card className="text-center hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-center mb-4 bg-gray-50 dark:bg-gray-800 w-12 h-12 rounded-full items-center mx-auto">
                                        {stat.icon}
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Our Story */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
                        <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                            <p>
                                Founded in 2024, Service Buddy began with a simple mission: to make finding reliable home service professionals as easy as ordering a pizza. We noticed a gap in the market where skilled local professionals struggled to find consistent work, while homeowners struggled to find trustworthy help.
                            </p>
                            <p>
                                What started as a small team in Berhampur has now grown into a nationwide platform connecting thousands of service professionals with millions of customers. We believe in dignity of labor and fair wages, ensuring our partners earn a sustainable livelihood while delivering top-notch service.
                            </p>
                            <p>
                                Today, we are more than just a booking app. We are a community that empowers micro-entrepreneurs and brings convenience to modern households.
                            </p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative h-96 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Placeholder for a team or office image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                            <TrendingUp className="h-32 w-32 text-blue-200 dark:text-gray-600" />
                        </div>
                    </motion.div>
                </div>

                {/* Our Values */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            These principles guide every decision we make and every service we deliver.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gray-900 dark:bg-blue-900 rounded-3xl p-12 text-center text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>

                    <h2 className="text-3xl font-bold mb-6 relative z-10">Ready to experience better service?</h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto relative z-10">
                        Join thousands of satisfied customers who trust Service Buddy for their home needs.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                        <Link href="/services">
                            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 w-full sm:w-auto">
                                Book a Service
                            </Button>
                        </Link>
                        <Link href="/join/technician">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                                Join as Partner
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    )
}

function MapIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            <line x1="9" x2="9" y1="3" y2="18" />
            <line x1="15" x2="15" y1="6" y2="21" />
        </svg>
    )
}

function CheckCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
