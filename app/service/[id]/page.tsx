"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServiceById, Service } from "@/lib/db/services";
import {
  Star,
  Clock,
  CheckCircle2,
  Shield,
  ThumbsUp,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Loader2
} from "lucide-react";

export default function ServiceDetailsPage() {
  const params = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState("standard");

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
        <Link href="/services" className="text-blue-600 hover:underline">
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/services" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Service Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Card */}
            <Card className="border-none shadow-sm overflow-hidden">
              <div className="h-64 bg-blue-100 dark:bg-gray-800 flex items-center justify-center text-8xl">
                {service.image}
              </div>
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{service.title}</h1>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-yellow-500 font-medium">
                        <Star className="h-4 w-4 fill-current mr-1" />
                        {service.rating} ({service.reviews} reviews)
                      </div>
                      <div className="text-gray-500">
                        {service.bookings} bookings
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">
                    Best Seller
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>What&apos;s Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-green-600 flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-2" /> Included
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" /> Professional tools & chemicals</li>
                      <li className="flex items-start"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" /> Hard water stain removal</li>
                      <li className="flex items-start"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" /> Floor scrubbing & polishing</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" /> Excluded
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start"><span className="text-red-400 mr-2">×</span> Furniture moving</li>
                      <li className="flex items-start"><span className="text-red-400 mr-2">×</span> Wet wall cleaning</li>
                      <li className="flex items-start"><span className="text-red-400 mr-2">×</span> Chimney cleaning (Add-on)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-none shadow-lg bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle>Select Package</CardTitle>
                  <CardDescription>Choose the best plan for your home</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="standard" onValueChange={setSelectedPackage} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="basic">Basic</TabsTrigger>
                      <TabsTrigger value="standard">Standard</TabsTrigger>
                      <TabsTrigger value="premium">Premium</TabsTrigger>
                    </TabsList>

                    {Object.entries(service.packages).map(([key, pkg]) => (
                      <TabsContent key={key} value={key} className="space-y-6">
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-3xl font-bold text-gray-900 dark:text-white">₹{pkg.price}</div>
                          <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
                            <Clock className="h-3 w-3 mr-1" /> {pkg.duration}
                          </div>
                        </div>

                        <div className="space-y-3">
                          {pkg.features.map((feature, i) => (
                            <div key={i} className="flex items-start text-sm">
                              <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all" asChild>
                          <Link href="/booking">
                            Book Slot
                          </Link>
                        </Button>

                        <p className="text-xs text-center text-gray-400">
                          No payment required now. Pay after service.
                        </p>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>

              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-200">Service Buddy Guarantee</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Verified professionals, insurance coverage, and re-work assurance if not satisfied.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}