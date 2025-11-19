"use client"

import { useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Home,
  Building
} from "lucide-react"

const serviceDetails = {
  "home-cleaning": {
    title: "Home Cleaning",
    icon: "🧹",
    packages: [
      { name: "Basic Clean", price: "₹299", duration: "2 hours" },
      { name: "Deep Clean", price: "₹499", duration: "3 hours" },
      { name: "Premium Clean", price: "₹699", duration: "4 hours" }
    ]
  },
  "plumbing": {
    title: "Plumbing Services",
    icon: "🔧",
    packages: [
      { name: "Leak Repair", price: "₹199", duration: "1 hour" },
      { name: "Pipe Installation", price: "₹399", duration: "2 hours" },
      { name: "Full System Check", price: "₹599", duration: "3 hours" }
    ]
  },
  "electrical": {
    title: "Electrical Services",
    icon: "⚡",
    packages: [
      { name: "Basic Repair", price: "₹249", duration: "1 hour" },
      { name: "Installation", price: "₹449", duration: "2 hours" },
      { name: "System Upgrade", price: "₹799", duration: "4 hours" }
    ]
  }
}

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
]

export default function BookingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const serviceId = params["service-id"] as string
  const selectedPackageParam = searchParams.get("package")

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPackage, setSelectedPackage] = useState(parseInt(selectedPackageParam || "0"))
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [bookingType, setBookingType] = useState<"home" | "office">("home")

  // Customer details
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    specialInstructions: ""
  })

  // Payment details
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("cod")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  })

  const service = serviceDetails[serviceId as keyof typeof serviceDetails]

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Service Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              The service you&apos;re trying to book doesn&apos;t exist.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const selectedPackageData = service.packages[selectedPackage]
  const totalPrice = selectedPackageData?.price || "₹0"

  const steps = [
    { id: 1, title: "Service Details", description: "Choose package and schedule" },
    { id: 2, title: "Customer Details", description: "Your information" },
    { id: 3, title: "Payment", description: "Complete booking" },
    { id: 4, title: "Confirmation", description: "Booking confirmed" }
  ]

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleBooking = () => {
    // Here you would typically send the booking data to your backend
    console.log("Booking data:", {
      serviceId,
      selectedPackage,
      selectedDate,
      selectedTime,
      bookingType,
      customerDetails,
      paymentMethod,
      cardDetails: paymentMethod === "card" ? cardDetails : null
    })

    // For demo purposes, just go to confirmation
    nextStep()
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Service Summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{service.icon}</div>
                  <div>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                    <CardDescription>Select your preferred package and schedule</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Package Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Package</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedPackage.toString()}
                  onValueChange={(value) => setSelectedPackage(parseInt(value))}
                  className="space-y-4"
                >
                  {service.packages.map((pkg, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <RadioGroupItem value={index.toString()} id={`package-${index}`} />
                      <Label htmlFor={`package-${index}`} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{pkg.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {pkg.duration}
                            </div>
                          </div>
                          <div className="text-lg font-bold text-blue-600">{pkg.price}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Booking Type */}
            <Card>
              <CardHeader>
                <CardTitle>Service Location</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={bookingType}
                  onValueChange={(value) => setBookingType(value as "home" | "office")}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home" className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Home className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="font-medium">Home Service</div>
                          <div className="text-sm text-gray-500">Service at your residence</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value="office" id="office" />
                    <Label htmlFor="office" className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="font-medium">Office Service</div>
                          <div className="text-sm text-gray-500">Service at your workplace</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Date & Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Select Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
                <CardDescription>Please provide your contact and address information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerDetails.name}
                      onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerDetails.phone}
                      onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={customerDetails.address}
                    onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                    placeholder="Enter your complete address"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={customerDetails.city}
                      onChange={(e) => setCustomerDetails({...customerDetails, city: e.target.value})}
                      placeholder="Enter your city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={customerDetails.pincode}
                      onChange={(e) => setCustomerDetails({...customerDetails, pincode: e.target.value})}
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={customerDetails.specialInstructions}
                    onChange={(e) => setCustomerDetails({...customerDetails, specialInstructions: e.target.value})}
                    placeholder="Any special instructions for the service provider"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{service.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Package:</span>
                  <span className="font-medium">{selectedPackageData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{selectedDate || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">{selectedTime || "Not selected"}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">{totalPrice}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as "card" | "upi" | "cod")}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">💵</div>
                        <div>
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-sm text-gray-500">Pay when service is completed</div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-6 w-6 text-blue-500" />
                        <div>
                          <div className="font-medium">Credit/Debit Card</div>
                          <div className="text-sm text-gray-500">Secure online payment</div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">📱</div>
                        <div>
                          <div className="font-medium">UPI Payment</div>
                          <div className="text-sm text-gray-500">Pay using UPI apps</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Card Details */}
                <AnimatePresence>
                  {paymentMethod === "card" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-4"
                    >
                      <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="card-name">Cardholder Name</Label>
                        <Input
                          id="card-name"
                          placeholder="John Doe"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and
                    <Link href="/privacy" className="text-blue-600 hover:underline ml-1">Privacy Policy</Link>.
                    I understand that cancellation is free up to 2 hours before the service.
                  </Label>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Booking Confirmed!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Your service has been successfully booked. We&apos;ll send you a confirmation SMS and email shortly.
            </p>

            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service:</span>
                    <span className="font-medium">{service.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Package:</span>
                    <span className="font-medium">{selectedPackageData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-medium">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total:</span>
                    <span className="font-bold text-blue-600">{totalPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => router.push("/profile/bookings")}>
                View My Bookings
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                Book Another Service
              </Button>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-500"
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? "text-blue-600" : "text-gray-500"
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-400">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <div key={currentStep}>
            {renderStepContent()}
          </div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={currentStep === 3 ? handleBooking : nextStep}
              disabled={
                (currentStep === 1 && (!selectedDate || !selectedTime)) ||
                (currentStep === 2 && (!customerDetails.name || !customerDetails.phone || !customerDetails.email || !customerDetails.address || !customerDetails.city || !customerDetails.pincode))
              }
            >
              {currentStep === 3 ? "Complete Booking" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}