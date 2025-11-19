"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link href="/" className="text-2xl font-bold text-blue-400 mb-4 inline-block">
                Service Buddy
              </Link>
              <p className="text-gray-300 mb-6 max-w-md">
                Your trusted partner for all home services. Making home maintenance simple and reliable with verified professionals.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className="bg-blue-600 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  4.8/5 Rating
                </Badge>
                <Badge variant="secondary" className="bg-green-600 text-white">
                  ✓ Verified
                </Badge>
                <Badge variant="secondary" className="bg-purple-600 text-white">
                  🏆 Award Winner
                </Badge>
              </div>
              {/* Social Links */}
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/services" className="hover:text-white transition-colors">Home Cleaning</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Plumbing</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Electrical</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Appliance Repair</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">View All Services</Link></li>
              </ul>
            </div>

            {/* Support & Company */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300 mb-6">
                <li><Link href="/support" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/profile" className="hover:text-white transition-colors">My Account</Link></li>
                <li><Link href="/profile/bookings" className="hover:text-white transition-colors">Track Booking</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>

              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <Phone className="h-5 w-5 mr-3 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Call us</p>
                <p className="font-semibold">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <Mail className="h-5 w-5 mr-3 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Email us</p>
                <p className="font-semibold">hello@servicebuddy.com</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <MapPin className="h-5 w-5 mr-3 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Visit us</p>
                <p className="font-semibold">Berhampur, Odisha</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-800" />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left text-gray-400">
              <p>&copy; 2024 Service Buddy. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
              <Link href="/support" className="hover:text-white transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}