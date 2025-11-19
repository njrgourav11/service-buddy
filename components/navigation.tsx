"use client"

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Search,
  MapPin,
  Menu,
  ChevronDown,
  LogIn,
  UserPlus,
  Home,
  Wrench,
  Car,
  Heart,
  Scissors,
  Zap,
  Droplets,
  Leaf,
  Star,
  MapIcon
} from "lucide-react"

const serviceCategories = [
  {
    name: "Home Cleaning",
    icon: <Home className="h-5 w-5" />,
    services: ["Deep Cleaning", "Regular Cleaning", "Move-in/Move-out", "Carpet Cleaning"],
    href: "/service/home-cleaning"
  },
  {
    name: "Plumbing",
    icon: <Droplets className="h-5 w-5" />,
    services: ["Leak Repair", "Pipe Installation", "Drain Cleaning", "Water Heater"],
    href: "/service/plumbing"
  },
  {
    name: "Electrical",
    icon: <Zap className="h-5 w-5" />,
    services: ["Wiring", "Lighting", "Switches", "Safety Inspection"],
    href: "/service/electrical"
  },
  {
    name: "Appliance Repair",
    icon: <Wrench className="h-5 w-5" />,
    services: ["AC Repair", "Refrigerator", "Washing Machine", "Microwave"],
    href: "/service/appliance-repair"
  },
  {
    name: "Pest Control",
    icon: <Star className="h-5 w-5" />,
    services: ["Termite Control", "Rodent Removal", "General Pest", "Disinfection"],
    href: "/service/pest-control"
  },
  {
    name: "Gardening",
    icon: <Leaf className="h-5 w-5" />,
    services: ["Lawn Care", "Planting", "Garden Design", "Tree Service"],
    href: "/service/gardening"
  },
  {
    name: "Beauty & Salon",
    icon: <Scissors className="h-5 w-5" />,
    services: ["Hair Cut", "Spa", "Massage", "Makeup"],
    href: "/service/beauty-salon"
  },
  {
    name: "Car Services",
    icon: <Car className="h-5 w-5" />,
    services: ["Car Wash", "Detailing", "Repair", "Towing"],
    href: "/service/car-services"
  },
  {
    name: "Health & Fitness",
    icon: <Heart className="h-5 w-5" />,
    services: ["Personal Training", "Yoga", "Nutrition", "Massage"],
    href: "/service/health-fitness"
  }
]

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Pune", "Hyderabad", "Kolkata", "Ahmedabad",
  "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal"
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState("Mumbai")
  const [locationOpen, setLocationOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Service Buddy
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {/* Services Mega Menu */}
            <Popover open={servicesOpen} onOpenChange={setServicesOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <span>Services</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[90vw] max-w-[800px] p-0" align="start">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                  {serviceCategories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-r border-gray-100 dark:border-gray-700 last:border-r-0"
                      onClick={() => setServicesOpen(false)}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-blue-600 dark:text-blue-400">
                          {category.icon}
                        </div>
                        <h3 className="font-semibold text-sm">{category.name}</h3>
                      </div>
                      <ul className="space-y-1">
                        {category.services.slice(0, 3).map((service) => (
                          <li key={service} className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                            {service}
                          </li>
                        ))}
                        <li className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          View all →
                        </li>
                      </ul>
                    </Link>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Link href="/services" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              All Services
            </Link>
            <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Profile
            </Link>
            <Link href="/support" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Support
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Location Picker */}
          <Dialog open={locationOpen} onOpenChange={setLocationOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="hidden lg:flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{selectedCity}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Select Your City</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose your location to see available services
                </p>
                <Command>
                  <CommandInput placeholder="Search cities..." />
                  <CommandList>
                    <CommandEmpty>No cities found.</CommandEmpty>
                    <CommandGroup>
                      {cities.map((city) => (
                        <CommandItem
                          key={city}
                          onSelect={() => {
                            setSelectedCity(city)
                            setLocationOpen(false)
                          }}
                          className={selectedCity === city ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                        >
                          <MapIcon className="mr-2 h-4 w-4" />
                          {city}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            </DialogContent>
          </Dialog>

          {/* Auth Buttons & Theme Toggle */}
          <div className="hidden lg:flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/auth/login">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[90vw] max-w-[350px] p-0">
                <div className="h-full flex flex-col">
                  <SheetHeader className="p-6 pb-4">
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <div className="flex flex-col space-y-4">
                    {/* Mobile Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 text-sm"
                      />
                    </div>

                    {/* Mobile Location */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full p-2 text-sm border rounded-md bg-white dark:bg-gray-800"
                      >
                        {cities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    {/* Mobile Navigation Links */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold mb-3 text-sm">Services</h3>
                        <div className="space-y-1">
                          {serviceCategories.slice(0, 6).map((category) => (
                            <Link
                              key={category.name}
                              href={category.href}
                              className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <div className="text-blue-600 dark:text-blue-400 text-sm">
                                {category.icon}
                              </div>
                              <span className="text-sm">{category.name}</span>
                            </Link>
                          ))}
                        </div>
                        <Link
                          href="/services"
                          className="block mt-2 text-blue-600 dark:text-blue-400 text-sm pl-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          View all services →
                        </Link>
                      </div>

                      <Link
                        href="/profile"
                        className="block p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>

                      <Link
                        href="/support"
                        className="block p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Support
                      </Link>
                    </div>

                    {/* Mobile Auth Buttons */}
                    <div className="space-y-2 pt-4 border-t">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                          <LogIn className="h-4 w-4 mr-2" />
                          Login
                        </Link>
                      </Button>
                      <Button size="sm" className="w-full" asChild>
                        <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Sign Up
                        </Link>
                      </Button>
                    </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}        