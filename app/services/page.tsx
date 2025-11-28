"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { getServices, Service } from "@/lib/db/services";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { ServiceCard } from "@/components/service-card";
import {
  Search,
  Filter,
  Star,
  Clock,
  Loader2,
} from "lucide-react";
import { ServiceIcon } from "@/components/service-icon";

const categories = ["Cleaning", "Appliance", "Electrical", "Plumbing", "Home Repair", "Beauty", "Wellness", "Gardening"];

function ServicesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const initialQuery = searchParams.get("q");

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [priceRange, setPriceRange] = useState([0, 5000]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    }
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialCategory, initialQuery]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(service.category);
    const matchesPrice = service.price >= priceRange[0] && service.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full md:w-72 flex-shrink-0 space-y-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-blue-600" />
                  Filters
                </h3>
                {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000 || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 px-2"
                    onClick={() => { setSelectedCategories([]); setPriceRange([0, 5000]); setSearchQuery(""); }}
                  >
                    Reset
                  </Button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h4 className="font-semibold mb-4 text-sm text-gray-900 dark:text-white uppercase tracking-wider">Category</h4>
                <div className="space-y-3">
                  {categories.map(category => (
                    <div key={category} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleCategory(category)}>
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                        className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-md"
                      />
                      <label htmlFor={category} className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-blue-600 transition-colors cursor-pointer select-none flex-1">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold mb-4 text-sm text-gray-900 dark:text-white uppercase tracking-wider">Price Range</h4>
                <Slider
                  defaultValue={[0, 5000]}
                  max={5000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-4"
                />
                <div className="flex justify-between items-center">
                  <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg text-sm font-medium">₹{priceRange[0]}</div>
                  <span className="text-gray-400">-</span>
                  <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg text-sm font-medium">₹{priceRange[1]}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Header */}
            <div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Find Services</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Discover the best professionals for your needs</p>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  placeholder="Search for services (e.g. 'AC Repair', 'Cleaning')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-2xl text-lg shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Services Grid */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                All Services
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} available
              </p>
            </div>

            {filteredServices.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                <div className="bg-gray-50 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No services found</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">We couldn't find any services matching your search or filters.</p>
                <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategories([]); setPriceRange([0, 5000]) }} className="rounded-full">
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ServiceCard
                      id={service.id}
                      title={service.title}
                      description={service.description}
                      price={`₹${service.price}`}
                      image={`https://images.unsplash.com/photo-${service.category === 'Cleaning' ? '1581578731548-c64695cc6952' :
                          service.category === 'Plumbing' ? '1607472586893-edb57bdc0e39' :
                            service.category === 'Electrical' ? '1621905251918-48416bd8575a' :
                              service.category === 'Appliance' ? '1556911220-e15b29be8c8f' :
                                service.category === 'Beauty' ? '1560066984-3ad0cf870f3e' :
                                  service.category === 'Gardening' ? '1416879595882-3373a0480b5b' :
                                    '1581578731548-c64695cc6952'
                        }?w=400&h=300&fit=crop`}
                      category={service.category}
                      rating={service.rating.toFixed(1)}
                      onAddToCart={() => {
                        window.location.href = `/service/${service.id}`;
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <ServicesContent />
    </Suspense>
  );
}