"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, MapPin, ArrowRight } from "lucide-react";

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden text-center"
            >
                <div className="bg-green-50 dark:bg-green-900/20 p-8 flex justify-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                        className="w-24 h-24 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center"
                    >
                        <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </motion.div>
                </div>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-500 mb-8">
                        Your service has been successfully booked. A confirmation email has been sent to you.
                    </p>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-8 text-left space-y-3">
                        <div className="flex items-start space-x-3">
                            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Date & Time</p>
                                <p className="font-semibold text-gray-900 dark:text-white">Mon, 25 Nov at 10:00 AM</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="font-semibold text-gray-900 dark:text-white">Flat 402, Sunshine Apartments</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                            <Link href="/profile/bookings">
                                View Booking
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/">
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
