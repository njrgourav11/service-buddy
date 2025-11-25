"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { getServices, Service } from "@/lib/db/services";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  Loader2
} from "lucide-react";

const categories = ["Cleaning", "Appliance", "Electrical", "Plumbing", "Home Repair", "Beauty", "Wellness"];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Filter className="h-4 w-4 text-gray-500" />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-sm text-gray-700 dark:text-gray-300">Category</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <label htmlFor={category} className="text-sm cursor-pointer select-none">{category}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-medium mb-3 text-sm text-gray-700 dark:text-gray-300">Price Range</h4>
                <Slider
                  defaultValue={[0, 5000]}
                  max={5000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">All Services</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                />
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/service/${service.id}`}>
                    <Card className="h-full hover:shadow-lg transition-all duration-300 border-none bg-white dark:bg-gray-900 group cursor-pointer">
                      <CardContent className="p-0">
                        <div className="h-48 bg-blue-50 dark:bg-gray-800 flex items-center justify-center text-6xl rounded-t-xl group-hover:bg-blue-100 dark:group-hover:bg-gray-800/80 transition-colors">
                          {service.image}
                        </div>
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary" className="mb-2 text-xs font-normal">
                              {service.category}
                            </Badge>
                            <div className="flex items-center text-sm font-medium text-yellow-500">
                              <Star className="h-4 w-4 fill-current mr-1" />
                              {service.rating}
                              <span className="text-gray-400 ml-1 font-normal">({service.reviews})</span>
                            </div>
                          </div>
                          <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>45-60 mins</span>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <span className="font-bold text-lg">₹{service.price}</span>
                            <Button size="sm" variant="outline" className="group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No services found matching your criteria.</p>
                <Button variant="link" onClick={() => { setSearchQuery(""); setSelectedCategories([]); setPriceRange([0, 5000]) }}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}