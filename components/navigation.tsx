"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationBell } from "@/components/notification-bell"
import { useAuth } from "@/context/AuthContext"
import {
  Search,
  MapPin,
  Menu,
  ChevronDown,
  LogIn,
  LogOut,
  User,
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
  MapIcon,
  X,
  BookOpen,
  Info
} from "lucide-react"

const serviceCategories = [
  {
    name: "Cleaning",
    icon: <Home className="h-5 w-5" />,
    services: ["Deep Cleaning", "Regular Cleaning", "Move-in/Move-out", "Carpet Cleaning"],
    href: "/services?category=Cleaning"
  },
  {
    name: "Plumbing",
    icon: <Droplets className="h-5 w-5" />,
    services: ["Leak Repair", "Pipe Installation", "Drain Cleaning", "Water Heater"],
    href: "/services?category=Plumbing"
  },
  {
    name: "Electrical",
    icon: <Zap className="h-5 w-5" />,
    services: ["Wiring", "Lighting", "Switches", "Safety Inspection"],
    href: "/services?category=Electrical"
  },
  {
    name: "Appliance",
    icon: <Wrench className="h-5 w-5" />,
    services: ["AC Repair", "Refrigerator", "Washing Machine", "Microwave"],
    href: "/services?category=Appliance"
  },
  {
    name: "Home Repair",
    icon: <Star className="h-5 w-5" />,
    services: ["Furniture Assembly", "Carpentry", "Painting", "General Repair"],
    href: "/services?category=Home%20Repair"
  },
  {
    name: "Gardening",
    icon: <Leaf className="h-5 w-5" />,
    services: ["Lawn Care", "Planting", "Garden Design", "Tree Service"],
    href: "/services?category=Gardening"
  },
  {
    name: "Beauty",
    icon: <Scissors className="h-5 w-5" />,
    services: ["Hair Cut", "Spa", "Massage", "Makeup"],
    href: "/services?category=Beauty"
  },
  {
    name: "Wellness",
    icon: <Heart className="h-5 w-5" />,
    services: ["Personal Training", "Yoga", "Nutrition", "Massage"],
    href: "/services?category=Wellness"
  }
]

const cities = [
  "Berhampur", "Gopalpur", "Chikiti", "Konisi", "Chatrapur", "Bhubaneswar", "Cuttack", "Bargarh",
  "Jajpur", "Sambalpur", "Balangir", "Balasore", "Bhadrak", "Thakurbari", "Baripada"
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState("Berhampur")
  const [locationOpen, setLocationOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { user, logout, loading } = useAuth()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isHomePage = pathname === "/"

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isHomePage
        ? "bg-white dark:bg-gray-950 shadow-sm border-b border-gray-200 dark:border-gray-800"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg group-hover:scale-105 transition-transform">
              <Wrench className="h-5 w-5" />
            </div>
            <span className={`text-2xl font-bold tracking-tight ${scrolled || !isHomePage ? "text-gray-900 dark:text-white" : "text-gray-900 dark:text-white"
              }`}>
              Service<span className="text-blue-600">Buddy</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Location Picker */}
            <Dialog open={locationOpen} onOpenChange={setLocationOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 mr-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full px-4">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">{selectedCity}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
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
                            className="cursor-pointer"
                          >
                            <MapIcon className="mr-2 h-4 w-4" />
                            {city}
                            {selectedCity === city && <Star className="ml-auto h-4 w-4 text-blue-600" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              </DialogContent>
            </Dialog>

            {/* Services Mega Menu */}
            <Popover open={servicesOpen} onOpenChange={setServicesOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="font-medium text-base">
                  Services
                  <ChevronDown className="ml-1 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[90vw] max-w-[900px] p-6" align="center" sideOffset={20}>
                <div className="grid grid-cols-3 gap-8">
                  {serviceCategories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="group flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => setServicesOpen(false)}
                    >
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-lg text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {category.services.slice(0, 2).join(", ")}...
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t flex justify-end">
                  <Link href="/services" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center">
                    View all services <ChevronDown className="ml-1 h-4 w-4 rotate-270" />
                  </Link>
                </div>
              </PopoverContent>
            </Popover>

            <Link href="/blog" className="px-4 py-2 text-sm font-medium hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <Link href="/about" className="px-4 py-2 text-sm font-medium hover:text-blue-600 transition-colors">
              About
            </Link>
          </div>

          {/* Auth Buttons & Theme Toggle */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            <NotificationBell />
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

            {loading ? (
              <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" className="font-medium" asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" className="font-medium" asChild>
                  <Link href="/auth/login">
                    Log in
                  </Link>
                </Button>
                <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-medium px-6 rounded-full shadow-lg hover:shadow-xl transition-all" asChild>
                  <Link href="/auth/register">
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center space-x-2">
            <NotificationBell />
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-0">
                <div className="flex flex-col h-full bg-white dark:bg-gray-900">
                  <div className="p-5 border-b flex items-center justify-between">
                    <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
                    <div className="flex items-center space-x-2">
                      <ThemeToggle />
                      {user && <NotificationBell />}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {/* Mobile Location */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Location</label>
                      <div className="flex items-center space-x-2 text-lg font-medium">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <select
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className="bg-transparent border-none focus:ring-0 p-0 w-full font-medium"
                        >
                          {cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Mobile Navigation Links */}
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Services</div>
                      {serviceCategories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className="text-blue-600 dark:text-blue-400">
                            {category.icon}
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </Link>
                      ))}
                    </div>

                    <div className="border-t pt-6 space-y-4">
                      <Link
                        href="/blog"
                        className="flex items-center space-x-3 p-2 font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <BookOpen className="h-5 w-5" />
                        <span>Blog</span>
                      </Link>
                      <Link
                        href="/about"
                        className="flex items-center space-x-3 p-2 font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Info className="h-5 w-5" />
                        <span>About</span>
                      </Link>
                      {user && (
                        <>
                          <Link
                            href="/profile"
                            className="flex items-center space-x-3 p-2 font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <UserPlus className="h-5 w-5" />
                            <span>Profile</span>
                          </Link>
                          <button
                            onClick={() => {
                              logout()
                              setMobileMenuOpen(false)
                            }}
                            className="flex items-center space-x-3 p-2 font-medium w-full text-left text-red-600"
                            type="button"
                          >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                          </button>
                        </>
                      )}
                      <Link
                        href="/support"
                        className="flex items-center space-x-3 p-2 font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Heart className="h-5 w-5" />
                        <span>Support</span>
                      </Link>
                    </div>
                  </div>

                  {/* Mobile Auth Buttons */}
                  <div className="p-5 border-t bg-gray-50 dark:bg-gray-800/50">
                    {loading ? (
                      <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
                    ) : user ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 px-2 mb-4">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {user.displayName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-medium">{user.displayName || "User"}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                            Log In
                          </Link>
                        </Button>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                          <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                            Sign Up
                          </Link>
                        </Button>
                      </div>
                    )}
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