"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getServiceById, Service } from "@/lib/db/services";
import { useAuth } from "@/context/AuthContext";
import {
  Star,
  Clock,
  CheckCircle2,
  Shield,
  ThumbsUp,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Loader2,
  Sparkles,
  LogIn,
  UserPlus,
} from "lucide-react";
import { ServiceIcon } from "@/components/service-icon";

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState("standard");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingBookingUrl, setPendingBookingUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      if (params.id) {
        try {
          const data = await getServiceById(params.id as string);
          setService(data);
        } catch (error) {
          console.error("Error fetching service:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchService();
  }, [params.id]);

  const handleBook = (packageId: string) => {
    const bookingUrl = `/booking?serviceId=${service?.id}&package=${packageId}`;

    if (user) {
      router.push(bookingUrl);
    } else {
      setPendingBookingUrl(bookingUrl);
      setShowAuthModal(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Service Not Found</h1>
        <Link href="/services" className="text-blue-600 hover:underline">
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/services" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Service Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Card */}
            <Card className="border-none shadow-sm overflow-hidden rounded-3xl bg-white dark:bg-gray-900">
              <div className="h-72 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-9xl relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <span className="drop-shadow-lg transform hover:scale-105 transition-transform duration-500">
                  <ServiceIcon
                    serviceId={service.id}
                    className="h-32 w-32 text-blue-600 dark:text-blue-400"
                    fallbackImage={service.image}
                  />
                </span>
              </div>
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h1>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg text-yellow-600 dark:text-yellow-400 font-semibold">
                        <Star className="h-4 w-4 fill-current mr-1" />
                        {service.rating} ({service.reviews} reviews)
                      </div>
                      <div className="text-gray-500 flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                        {service.bookings} bookings
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none px-3 py-1 text-sm rounded-full">
                    Best Seller
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
                  {service.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                      <div className="bg-white dark:bg-gray-700 p-1.5 rounded-full mr-3 shadow-sm">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card className="border-none shadow-sm rounded-3xl bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="text-xl">What&apos;s Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 bg-green-50 dark:bg-green-900/10 p-5 rounded-2xl">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 flex items-center">
                      <ThumbsUp className="h-5 w-5 mr-2" /> Included
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start"><CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" /> Professional tools & chemicals</li>
                      <li className="flex items-start"><CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" /> Hard water stain removal</li>
                      <li className="flex items-start"><CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" /> Floor scrubbing & polishing</li>
                    </ul>
                  </div>
                  <div className="space-y-4 bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" /> Excluded
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start"><span className="text-red-500 mr-2 font-bold text-lg leading-none">×</span> Furniture moving</li>
                      <li className="flex items-start"><span className="text-red-500 mr-2 font-bold text-lg leading-none">×</span> Wet wall cleaning</li>
                      <li className="flex items-start"><span className="text-red-500 mr-2 font-bold text-lg leading-none">×</span> Chimney cleaning (Add-on)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="border-none shadow-lg bg-white dark:bg-gray-900 rounded-3xl overflow-hidden ring-1 ring-gray-100 dark:ring-gray-800">
                <CardHeader className="bg-gray-50 dark:bg-gray-800/50 pb-6">
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
                    Select Package
                  </CardTitle>
                  <CardDescription>Choose the best plan for your home</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs defaultValue="standard" onValueChange={setSelectedPackage} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                      <TabsTrigger value="basic" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Basic</TabsTrigger>
                      <TabsTrigger value="standard" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Standard</TabsTrigger>
                      <TabsTrigger value="premium" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Premium</TabsTrigger>
                    </TabsList>

                    {Object.entries(service.packages).map(([key, pkg]) => (
                      <TabsContent key={key} value={key} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">₹{pkg.price}</div>
                          <div className="text-sm text-blue-600 dark:text-blue-300 flex items-center justify-center font-medium">
                            <Clock className="h-4 w-4 mr-1.5" /> {pkg.duration}
                          </div>
                        </div>

                        <div className="space-y-4">
                          {pkg.features.map((feature, i) => (
                            <div key={i} className="flex items-start text-sm">
                              <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          className="w-full h-14 text-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 shadow-xl hover:shadow-2xl transition-all rounded-full mt-4 group"
                          onClick={() => handleBook(key)}
                        >
                          Book Slot <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        <p className="text-xs text-center text-gray-400 font-medium">
                          No payment required now. Pay after service.
                        </p>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>

              <div className="bg-blue-600 text-white p-5 rounded-2xl flex items-start space-x-4 shadow-lg">
                <Shield className="h-6 w-6 mt-1 opacity-90" />
                <div>
                  <h4 className="font-bold text-base mb-1">Service Buddy Guarantee</h4>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    Verified professionals, insurance coverage, and re-work assurance if not satisfied.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">Sign In Required</DialogTitle>
            <DialogDescription className="text-center pt-2">
              You need to be signed in to book a service. Please sign in or create an account to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button className="w-full h-12 text-lg" asChild>
              <Link href={`/auth/login?redirect=${encodeURIComponent(pendingBookingUrl || "")}`}>
                <LogIn className="mr-2 h-5 w-5" /> Sign In
              </Link>
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button variant="outline" className="w-full h-12 text-lg" asChild>
              <Link href={`/auth/register?redirect=${encodeURIComponent(pendingBookingUrl || "")}`}>
                <UserPlus className="mr-2 h-5 w-5" /> Create Account
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}