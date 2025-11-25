"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CreditCard, Wallet, Banknote, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Razorpay: any;
    }
}

function PaymentContent() {
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const bookingId = searchParams.get("bookingId");

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
                } else {
                    setError("Booking not found.");
                }
            } catch (err) {
                console.error("Error fetching booking:", err);
                setError("Failed to load booking details.");
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId]);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!booking) return;
        setIsProcessing(true);
        setError("");

        try {
            if (paymentMethod === "cash") {
                // Handle Cash Payment
                await updateBooking("cash", "pending_verification", "confirmed");
                router.push("/payment/success");
                return;
            }

            // Handle Online Payment (Razorpay)
            const res = await loadRazorpay();
            if (!res) {
                throw new Error("Razorpay SDK failed to load. Are you online?");
            }

            // Create Order
            const orderRes = await fetch("/api/razorpay/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: booking.amount }),
            });

            if (!orderRes.ok) throw new Error("Failed to create order");
            const order = await orderRes.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Service Buddy",
                description: `Payment for ${booking.serviceName}`,
                order_id: order.id,
                handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
                    // Verify payment and update booking
                    await updateBooking("online", "paid", "confirmed", response);
                    router.push("/payment/success");
                },
                prefill: {
                    name: user?.displayName || "",
                    email: user?.email || "",
                    contact: "", // Add phone if available
                },
                theme: {
                    color: "#2563EB",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const updateBooking = async (method: string, paymentStatus: string, bookingStatus: string, paymentDetails?: unknown) => {
        if (!bookingId) return;

        try {
            const bookingRef = doc(db, "bookings", bookingId);
            await updateDoc(bookingRef, {
                paymentMethod: method,
                paymentStatus: paymentStatus,
                status: bookingStatus,
                paymentDetails: paymentDetails || {},
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error updating booking:", error);
            throw new Error("Failed to update booking");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
                <h1 className="text-2xl font-bold mb-4">Invalid Booking</h1>
                <Button asChild><Link href="/services">Back to Services</Link></Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Secure Payment</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Payment Methods */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                            <CardHeader className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                                <CardTitle>Select Payment Method</CardTitle>
                                <CardDescription>Choose how you want to pay</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 bg-white dark:bg-gray-900">
                                {error && (
                                    <Alert variant="destructive" className="mb-6 rounded-xl">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                                    <div className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "card" ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-800 hover:border-gray-300"}`}>
                                        <RadioGroupItem value="card" id="card" />
                                        <Label htmlFor="card" className="flex-1 flex items-center cursor-pointer">
                                            <CreditCard className="h-5 w-5 mr-3 text-blue-600" />
                                            <div>
                                                <p className="font-semibold text-base">Pay Online</p>
                                                <p className="text-sm text-gray-500">Credit/Debit Card, UPI, Netbanking</p>
                                            </div>
                                        </Label>
                                    </div>

                                    <div className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "cash" ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-800 hover:border-gray-300"}`}>
                                        <RadioGroupItem value="cash" id="cash" />
                                        <Label htmlFor="cash" className="flex-1 flex items-center cursor-pointer">
                                            <Banknote className="h-5 w-5 mr-3 text-green-600" />
                                            <div>
                                                <p className="font-semibold text-base">Pay After Service</p>
                                                <p className="text-sm text-gray-500">Cash or UPI after job completion</p>
                                            </div>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </CardContent>
                            <CardFooter className="p-6 bg-gray-50/50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                                <Button
                                    className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-blue-500/25"
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        `Pay ₹${booking.amount}`
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                            <CardHeader className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6 bg-white dark:bg-gray-900">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Service</span>
                                    <span className="font-medium text-right">{booking.serviceName}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Package</span>
                                    <span className="font-medium capitalize">{booking.package}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Date</span>
                                    <span className="font-medium">{new Date(booking.date).toLocaleDateString()}</span>
                                </div>
                                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{booking.amount}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <Shield className="h-4 w-4" />
                            <span>Safe & Secure Payment</span>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}
