"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAdminStats } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, User, MapPin, Briefcase } from "lucide-react";

export default function ManagerTechniciansPage() {
    const { user, loading: authLoading } = useAuth();
    const [technicians, setTechnicians] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [selectedTech, setSelectedTech] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const token = await user.getIdToken(true);
                    const result = await getAdminStats(token);

                    if (result.success && result.data) {
                        setTechnicians(result.data.technicians);
                    }
                } catch (error) {
                    console.error("Error fetching manager data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (!authLoading) {
            fetchData();
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Technicians</CardTitle>
                    <CardDescription>View available technicians</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {technicians.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No technicians found.</p>
                        ) : (
                            technicians.map((tech) => (
                                <div key={tech.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors gap-4">
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarFallback>{tech.fullName?.[0] || "T"}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{tech.fullName}</p>
                                            <p className="text-sm text-gray-500 capitalize">{tech.category} • {tech.experience} years exp</p>
                                            <p className="text-xs text-gray-400">{tech.city}, {tech.state}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                                        <Badge variant={
                                            tech.status === "approved" ? "default" :
                                                tech.status === "rejected" ? "destructive" : "secondary"
                                        }>
                                            {tech.status}
                                        </Badge>
                                        <Button variant="outline" size="sm" onClick={() => setSelectedTech(tech)}>
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Technician Details Modal */}
            <Dialog open={!!selectedTech} onOpenChange={(open) => !open && setSelectedTech(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Technician Details</DialogTitle>
                        <DialogDescription>Details for {selectedTech?.fullName}</DialogDescription>
                    </DialogHeader>

                    {selectedTech && (
                        <div className="grid gap-6 py-4">
                            {/* Personal Info */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg flex items-center"><User className="mr-2 h-4 w-4" /> Personal Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500 block">Full Name</span>
                                        <span className="font-medium">{selectedTech.fullName}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Email</span>
                                        <span className="font-medium">{selectedTech.email}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Phone</span>
                                        <span className="font-medium">{selectedTech.phone}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gray-200 dark:bg-gray-800" />

                            {/* Location */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg flex items-center"><MapPin className="mr-2 h-4 w-4" /> Location</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="col-span-2">
                                        <span className="text-gray-500 block">Address</span>
                                        <span className="font-medium">{selectedTech.address}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">City</span>
                                        <span className="font-medium">{selectedTech.city}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Area</span>
                                        <span className="font-medium">{selectedTech.area || "N/A"}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">State</span>
                                        <span className="font-medium">{selectedTech.state}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Zip Code</span>
                                        <span className="font-medium">{selectedTech.zip}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gray-200 dark:bg-gray-800" />

                            {/* Professional */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg flex items-center"><Briefcase className="mr-2 h-4 w-4" /> Professional Profile</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500 block">Category</span>
                                        <span className="font-medium capitalize">{selectedTech.category}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Experience</span>
                                        <span className="font-medium">{selectedTech.experience} Years</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-gray-500 block">Bio</span>
                                        <p className="font-medium mt-1">{selectedTech.bio || "No bio provided."}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
