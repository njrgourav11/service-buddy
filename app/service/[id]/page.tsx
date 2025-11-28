"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import {
  Star,
  Clock,
  CheckCircle2,
  Shield,
  ThumbsUp,
  AlertCircle,
  ArrowLeft,
  Wrench,
  Lightbulb,
  Handshake,
  Loader2,
  Sparkles,
  LogIn,
  UserPlus,
} from "lucide-react";
import { ServiceIcon } from "@/components/service-icon";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { getServiceById, Service } from "@/lib/db/services";

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

  const { showToast } = useToast();
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = () => {
    if (!service) return;

    setIsAddingToCart(true);
    const selectedPkg = service.packages[selectedPackage];
    const price = selectedPkg ? selectedPkg.price : service.price;

    addToCart({
      serviceId: service.id,
      title: service.title,
      price: price,
      image: service.image,
      packageType: selectedPackage
    });

    // Simulate a small delay for visual feedback
    setTimeout(() => {
      setIsAddingToCart(false);
      showToast({
        title: "Added to Cart",
        description: `${service.title} (${selectedPackage}) has been added to your cart.`,
        variant: "success",
        styleVariant: "filled"
      });
    }, 500);
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
        <Button asChild><Link href="/services">Back to Services</Link></Button>
      </div>
    );
  }

  const selectedPkg = service.packages[selectedPackage];
  const price = selectedPkg ? selectedPkg.price : service.price;

  // Placeholder for features array
  const features = [
    {
      icon: <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      title: "Expert Technicians",
      description: "Certified and experienced professionals for every job.",
    },
    {
      icon: <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      title: "Quality Assurance",
      description: "We guarantee high-quality service and customer satisfaction.",
    },
    {
      icon: <Handshake className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      title: "Transparent Pricing",
      description: "No hidden fees, clear and upfront costs for all services.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Hero Section */}
      <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-blue-600/20 mix-blend-multiply z-10" />

        {/* Service Icon Background */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <ServiceIcon
            serviceId={service.id}
            className="w-64 h-64 text-gray-300 dark:text-gray-600 opacity-50"
            fallbackImage={service.image}
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 lg:p-12 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-32">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-blue-600 hover:bg-blue-700 text-white border-none px-4 py-1.5 text-sm font-medium rounded-full shadow-lg backdrop-blur-sm">
                {service.category}
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 tracking-tight shadow-sm">
                {service.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm lg:text-base font-medium">
                <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5">
                  <Star className="h-5 w-5 text-yellow-400 fill-current mr-2" />
                  <span className="font-bold">{service.rating}</span>
                  <span className="mx-1.5 opacity-50">|</span>
                  <span>{service.reviews} reviews</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>45-60 mins</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5">
                  <Shield className="h-5 w-5 mr-2 text-green-400" />
                  <span>Verified Partner</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white dark:bg-gray-900">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About this Service</h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                    {service.description}
                  </p>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                        <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm mr-4">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white dark:bg-gray-900">
                <CardHeader className="p-8 pb-0">
                  <CardTitle className="text-2xl">Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="border-b border-gray-100 dark:border-gray-800 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3" />
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">User Name</p>
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, j) => (
                                  <Star key={j} className="h-3 w-3 fill-current" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">2 days ago</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          Great service! The professional was very polite and did an excellent job.
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800">
                  <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 p-6 border-b border-gray-100 dark:border-gray-800">
                    <CardTitle className="text-xl">Select Package</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-3">
                      {Object.entries(service.packages).map(([key, pkg]: [string, any]) => (
                        <div
                          key={key}
                          className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${selectedPackage === key
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                            : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          onClick={() => setSelectedPackage(key)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold capitalize text-gray-900 dark:text-white text-lg">{key}</h3>
                            {selectedPackage === key && (
                              <div className="bg-blue-600 text-white p-1 rounded-full">
                                <CheckCircle2 className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <ul className="space-y-1.5 mb-3">
                            {pkg.features.map((feature: string, i: number) => (
                              <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <div className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                            ₹{pkg.price}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-500 font-medium">Total Price</span>
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{price}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full rounded-xl border-2 font-bold h-12 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                          onClick={handleAddToCart}
                          disabled={isAddingToCart}
                        >
                          {isAddingToCart ? "Adding..." : "Add to Cart"}
                        </Button>
                        <Button
                          size="lg"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold h-12 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
                          onClick={() => handleBook(selectedPackage)}
                        >
                          Book Now
                        </Button>
                      </div>
                      <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center">
                        <Shield className="h-3 w-3 mr-1" />
                        Secure payment & satisfaction guarantee
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Dialog */}
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