"use client"

import { useState } from "react"
import { Search, MapPin, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SearchBarProps {
  onSearch?: (query: string) => void
  onLocationChange?: (location: string) => void
}

export function SearchBar({ onSearch, onLocationChange }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("Current Location")
  const [isLocationOpen, setIsLocationOpen] = useState(false)

  const popularSearches = [
    "Home Cleaning",
    "Plumbing",
    "Electrical",
    "AC Repair",
    "Pest Control"
  ]

  const handleSearch = () => {
    onSearch?.(searchQuery)
  }

  const handleLocationSelect = (newLocation: string) => {
    setLocation(newLocation)
    setIsLocationOpen(false)
    onLocationChange?.(newLocation)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-2">
        <div className="flex flex-col md:flex-row gap-2">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for services (e.g., cleaning, plumbing, electrical)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 border-0 focus:ring-0 text-base"
            />
          </div>

          {/* Location Selector */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="w-full md:w-auto justify-start border-gray-300 dark:border-gray-600"
            >
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              {location}
            </Button>

            {isLocationOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">Select Location</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsLocationOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {["Current Location", "Mumbai", "Delhi", "Bangalore", "Chennai", "Pune"].map((loc) => (
                      <button
                        key={loc}
                        onClick={() => handleLocationSelect(loc)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 px-8"
          >
            Search
          </Button>
        </div>

        {/* Popular Searches */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((search) => (
              <Badge
                key={search}
                variant="secondary"
                className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                onClick={() => {
                  setSearchQuery(search)
                  onSearch?.(search)
                }}
              >
                {search}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}