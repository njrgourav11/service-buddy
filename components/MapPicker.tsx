"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";

// Fix for default marker icon in Leaflet with Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface MapPickerProps {
    onLocationSelect: (location: { lat: number; lng: number; address: string; addressDetails?: any }) => void;
    initialLocation?: { lat: number; lng: number };
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    const [position, setPosition] = useState<L.LatLng | null>(null);
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={icon} />
    );
}

import { useToast } from "@/context/ToastContext";

// ... (imports remain same)

export default function MapPicker({ onLocationSelect, initialLocation }: MapPickerProps) {
    const [loading, setLoading] = useState(false);
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(initialLocation || null);
    const { showToast } = useToast();

    const handleLocationSelect = async (lat: number, lng: number) => {
        // ... (implementation remains same)
        setPosition({ lat, lng });
        setLoading(true);
        try {
            // Reverse Geocoding using Nominatim (OpenStreetMap)
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            onLocationSelect({
                lat,
                lng,
                address: data.display_name || "Unknown Location",
                addressDetails: data.address
            });
        } catch (error) {
            console.error("Error reverse geocoding:", error);
            onLocationSelect({ lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
        } finally {
            setLoading(false);
        }
    };

    const handleLocateMe = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    handleLocationSelect(latitude, longitude);
                },
                (err) => {
                    console.error("Error getting location:", err);
                    setLoading(false);
                    showToast({
                        title: "Location Error",
                        description: "Could not get your location. Please enable location services.",
                        variant: "error",
                    });
                }
            );
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Click on the map to select location</p>
                <Button variant="outline" size="sm" onClick={handleLocateMe} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}
                    Locate Me
                </Button>
            </div>
            <div className="h-[300px] w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 relative z-0">
                <MapContainer
                    center={initialLocation ? [initialLocation.lat, initialLocation.lng] : [20.2961, 85.8245]} // Default to Bhubaneswar
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker onLocationSelect={handleLocationSelect} />
                    {position && <Marker position={[position.lat, position.lng]} icon={icon} />}
                </MapContainer>
            </div>
        </div>
    );
}
