"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, MapPin, Download, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getInvoice } from "@/actions/payment";

function SuccessContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get("bookingId");
    const { user } = useAuth();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId) {
                setLoading(false);
                return;
            }
            try {
                const docRef = doc(db, "bookings", bookingId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setBooking({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (err) {
                console.error("Error fetching booking:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId]);

    const handleDownloadInvoice = async () => {
        if (!booking?.invoiceId) {
            alert("Invoice is being generated. Please check back in a moment.");
            return;
        }
        try {
            const result = await getInvoice(booking.invoiceId);
            if (result.success && result.invoice) {
                const newWindow = window.open("", "_blank");
                if (newWindow) {
                    newWindow.document.write(result.invoice.html);
                    newWindow.document.close();
                    newWindow.print();
                }
            } else {
                alert("Failed to load invoice");
            }
        } catch (error) {
            console.error("Error downloading invoice:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

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

                    {booking && (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-8 text-left space-y-3">
                            <div className="flex items-start space-x-3">
                                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Date & Time</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="font-semibold text-gray-900 dark:text-white line-clamp-2">{booking.address}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Button variant="outline" className="w-full" onClick={handleDownloadInvoice}>
                            <Download className="h-4 w-4 mr-2" /> Download Invoice
                        </Button>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                            <Link href="/profile">
                                View Booking
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full" asChild>
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

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
