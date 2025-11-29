"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    ChevronLeft,
    ChevronRight,
    MapPin,
    Calendar as CalendarIcon,
    CheckCircle2,
    Plus,
    Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { createBooking } from "@/actions/booking";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">Loading Map...</div>
});

const steps = [
    { id: 1, title: "Select Slot" },
    { id: 2, title: "Address" },
    { id: 3, title: "Summary" }
];

const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM", "07:00 PM"
];

// Mock addresses for now - in production, fetch from user profile
const savedAddresses = [
    { id: "1", type: "Home", address: "Flat 402, Sunshine Apartments, MG Road, Bangalore - 560001" },
    { id: "2", type: "Office", address: "Tech Park, Sector 5, Bangalore - 560103" }
];

function CheckoutContent() {
    const router = useRouter();
    const { user } = useAuth();
    const { items, cartTotal, clearCart } = useCart();

    const [currentStep, setCurrentStep] = useState(1);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<string>(savedAddresses[0].id);
    const [newAddress, setNewAddress] = useState(false);
    const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
    const [customAddress, setCustomAddress] = useState("");
    const [processing, setProcessing] = useState(false);

    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (items.length === 0 && !isRedirecting) {
            router.push("/cart");
        }
    }, [items, router, isRedirecting]);

    const handleNext = async () => {
        if (currentStep < steps.length) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Create Bookings
            await handleCreateBookings();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleCreateBookings = async () => {
        if (!user || items.length === 0) return;
        setProcessing(true);

        try {
            const token = await user.getIdToken();
            let addressStr = "";
            if (selectedAddress === "new" && mapLocation) {
                addressStr = customAddress || mapLocation.address;
            } else {
                addressStr = savedAddresses.find(a => a.id === selectedAddress)?.address || "Custom Address";
            }

            // Create a booking for each item in the cart
            // Note: In a real app, you might want to batch these or create a single "Order" with multiple "OrderItems"
            // For now, we'll create individual bookings to maintain compatibility with the existing system

            const bookingPromises = items.map(item => {
                const taxes = Math.round(item.price * 0.18);
                const total = item.price + taxes;

                const bookingData = {
                    userId: user.uid,
                    userName: user.displayName || "User",
                    serviceId: item.serviceId,
                    serviceName: item.title,
                    package: item.packageType,
                    amount: total,
                    date: date?.toISOString(),
                    time: selectedTime,
                    address: addressStr,
                };
                return createBooking(bookingData, token);
            });

            console.log('Creating bookings for', items.length, 'items');
            const results = await Promise.all(bookingPromises);
            console.log('Booking results:', results);

            const failed = results.filter(r => !r.success);

            if (failed.length === 0) {
                // All successful - redirect to payment for the first booking
                const firstBookingId = results[0]?.bookingId;

                if (!firstBookingId) {
                    console.error('No booking ID returned from first booking');
                    alert("Error: No booking ID received. Please try again.");
                    return;
                }

                console.log('Redirecting to payment with bookingId:', firstBookingId);
                setIsRedirecting(true); // Prevent redirect to cart
                clearCart();
                router.push(`/payment?bookingId=${firstBookingId}`);
            } else {
                console.error('Failed bookings:', failed);
                alert("Failed to create some bookings. Please try again.");
            }
        } catch (error) {
            console.error("Error creating bookings:", error);
            alert("Failed to create bookings. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    if (items.length === 0 && !isRedirecting) {
        return null; // Redirecting in useEffect
    }

    const taxes = Math.round(cartTotal * 0.18);
    const totalAmount = cartTotal + taxes;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Stepper */}
                <div className="mb-8">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 -z-10" />
                        {steps.map((step) => (
                            <div key={step.id} className="flex flex-col items-center bg-gray-50 dark:bg-gray-950 px-2">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${currentStep >= step.id
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 dark:bg-gray-800 text-gray-500"
                                        }`}
                                >
                                    {currentStep > step.id ? <CheckCircle2 className="h-6 w-6" /> : step.id}
                                </div>
                                <span className={`mt-2 text-xs font-medium ${currentStep >= step.id ? "text-blue-600" : "text-gray-500"
                                    }`}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
                    <CardHeader className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                        <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                        <CardDescription>
                            {currentStep === 1 && "Choose a date and time for your services"}
                            {currentStep === 2 && "Select the address for service delivery"}
                            {currentStep === 3 && "Review your booking details"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="min-h-[400px] p-6 bg-white dark:bg-gray-900">
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                                >
                                    <div>
                                        <Label className="mb-4 block font-medium">Select Date</Label>
                                        <div className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                disabled={(date) => date < new Date()}
                                                className="rounded-md border-0"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="mb-4 block font-medium">Select Time</Label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {timeSlots.map((time) => (
                                                <Button
                                                    key={time}
                                                    variant={selectedTime === time ? "default" : "outline"}
                                                    className={`text-sm rounded-xl h-10 ${selectedTime === time ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                                                    onClick={() => setSelectedTime(time)}
                                                >
                                                    {time}
                                                </Button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-4">
                                            * This slot will apply to all {items.length} services in your cart.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                                        {savedAddresses.map((addr) => (
                                            <div key={addr.id} className={`flex items-start space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress === addr.id ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
                                                }`}>
                                                <RadioGroupItem value={addr.id} id={addr.id} className="mt-1" />
                                                <div className="flex-1">
                                                    <Label htmlFor={addr.id} className="font-bold cursor-pointer text-base">{addr.type}</Label>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{addr.address}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </RadioGroup>

                                    <Button variant="outline" className="w-full border-dashed h-12 rounded-xl" onClick={() => { setSelectedAddress("new"); setNewAddress(true); }}>
                                        <Plus className="h-4 w-4 mr-2" /> Add New Address
                                    </Button>

                                    {selectedAddress === "new" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="space-y-4 pt-4 border-t"
                                        >
                                            <MapPicker onLocationSelect={(loc) => {
                                                setMapLocation(loc);
                                                setCustomAddress(loc.address);
                                            }} />

                                            <div className="space-y-2">
                                                <Label>Full Address</Label>
                                                <Input
                                                    placeholder="Enter complete address"
                                                    className="rounded-xl"
                                                    value={customAddress}
                                                    onChange={(e) => setCustomAddress(e.target.value)}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl space-y-4 border border-gray-100 dark:border-gray-800">
                                        <h3 className="font-bold text-lg mb-2">Booking Details</h3>
                                        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                                    <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Date & Time</p>
                                                    <p className="font-semibold">
                                                        {date ? format(date, "PPP") : "Select Date"} at {selectedTime || "Select Time"}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} className="text-blue-600 hover:text-blue-700">Edit</Button>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                                                    <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Address</p>
                                                    <p className="font-semibold text-sm max-w-[200px] truncate">
                                                        {selectedAddress === "new" ? (customAddress || mapLocation?.address) : savedAddresses.find(a => a.id === selectedAddress)?.address}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)} className="text-blue-600 hover:text-blue-700">Edit</Button>
                                        </div>
                                    </div>

                                    <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <h4 className="font-semibold">Services Summary</h4>
                                        {items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">{item.title} ({item.packageType})</span>
                                                <span>₹{item.price}</span>
                                            </div>
                                        ))}

                                        <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                                <span>₹{cartTotal}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Taxes & Fees (18%)</span>
                                                <span>₹{taxes}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <span>Total Amount</span>
                                            <span>₹{totalAmount}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-gray-100 dark:border-gray-800 p-6 bg-gray-50/50 dark:bg-gray-900">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 1 || processing}
                            className={`rounded-xl ${currentStep === 1 ? "invisible" : ""}`}
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" /> Back
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={
                                (currentStep === 1 && (!date || !selectedTime)) ||
                                (currentStep === 2 && (!selectedAddress || (selectedAddress === "new" && !customAddress))) ||
                                (currentStep === 3 && (!date || !selectedTime || !selectedAddress)) ||
                                processing
                            }
                            className="bg-blue-600 hover:bg-blue-700 min-w-[140px] rounded-xl shadow-lg hover:shadow-blue-500/25"
                        >
                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : currentStep === steps.length ? "Proceed to Pay" : "Next"}
                            {currentStep !== steps.length && !processing && <ChevronRight className="h-4 w-4 ml-2" />}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
