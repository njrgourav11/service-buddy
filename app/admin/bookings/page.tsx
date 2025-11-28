"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAdminStats, assignTechnician } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function AdminBookingsPage() {
    const { user, loading: authLoading } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [technicians, setTechnicians] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [assignTechId, setAssignTechId] = useState<string>("");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const token = await user.getIdToken(true);
                    const result = await getAdminStats(token);

                    if (result.success && result.data) {
                        setBookings(result.data.bookings);
                        setTechnicians(result.data.technicians);
                    }
                } catch (error) {
                    console.error("Error fetching admin data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (!authLoading) {
            fetchData();
        }
    }, [user, authLoading]);

    const handleAssignTechnician = async () => {
        if (!selectedBooking || !assignTechId || !user) return;
        setActionLoading(true);

        try {
            const token = await user.getIdToken();
            const result = await assignTechnician(selectedBooking.id, assignTechId, token);

            if (result.success) {
                const tech = technicians.find(t => t.id === assignTechId);
                setBookings(prev => prev.map(b => b.id === selectedBooking.id ? {
                    ...b,
                    technicianId: assignTechId,
                    technicianName: tech?.fullName,
                    status: "assigned"
                } : b));
                setSelectedBooking(null);
                setAssignTechId("");
            } else {
                alert("Failed to assign technician: " + result.error);
            }
        } catch (error) {
            console.error("Error assigning technician:", error);
            alert("Failed to assign technician");
        } finally {
            setActionLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">All Bookings</h2>
                <p className="text-muted-foreground">Manage and assign bookings</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Bookings List</CardTitle>
                    <CardDescription>View and manage all service bookings</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 overflow-x-auto">
                        {bookings.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No bookings found.</p>
                        ) : (
                            <div className="rounded-md border min-w-[600px]">
                                <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 dark:bg-gray-900 font-medium text-sm">
                                    <div className="col-span-2">Service Details</div>
                                    <div>Customer</div>
                                    <div>Date & Time</div>
                                    <div>Status</div>
                                    <div className="text-right">Action</div>
                                </div>
                                {bookings.map((booking) => (
                                    <div key={booking.id} className="grid grid-cols-6 gap-4 p-4 border-t items-center text-sm">
                                        <div className="col-span-2">
                                            <p className="font-semibold">{booking.serviceName}</p>
                                            <p className="text-xs text-gray-500">{booking.address}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">{booking.userName}</p>
                                        </div>
                                        <div>
                                            <p>{new Date(booking.date).toLocaleDateString()}</p>
                                            <p className="text-xs text-gray-500">{booking.time}</p>
                                        </div>
                                        <div>
                                            <Badge variant={
                                                booking.status === "confirmed" ? "default" :
                                                    booking.status === "assigned" ? "secondary" :
                                                        booking.status === "completed" ? "outline" : "destructive"
                                            }>
                                                {booking.status}
                                            </Badge>
                                            {booking.technicianName && (
                                                <p className="text-xs text-gray-500 mt-1">Tech: {booking.technicianName}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            {booking.status === "confirmed" || booking.status === "pending_verification" ? (
                                                <Button size="sm" onClick={() => setSelectedBooking(booking)}>Assign</Button>
                                            ) : (
                                                <Button size="sm" variant="outline" disabled>
                                                    {booking.status === "assigned" ? "Reassign" : "View"}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Assign Technician Modal */}
            <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Technician</DialogTitle>
                        <DialogDescription>
                            Select a technician for {selectedBooking?.serviceName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Available Technicians</Label>
                            <Select value={assignTechId} onValueChange={setAssignTechId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a technician" />
                                </SelectTrigger>
                                <SelectContent>
                                    {technicians
                                        .filter(t => t.status === "approved")
                                        .map((tech) => (
                                            <SelectItem key={tech.id} value={tech.id}>
                                                {tech.fullName} ({tech.category})
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedBooking(null)}>Cancel</Button>
                        <Button onClick={handleAssignTechnician} disabled={!assignTechId || actionLoading}>
                            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Assign
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
