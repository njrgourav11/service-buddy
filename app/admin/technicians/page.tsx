"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAdminStats, approveTechnician } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, FileText } from "lucide-react";

export default function AdminTechniciansPage() {
    const { user, loading: authLoading } = useAuth();
    const [technicians, setTechnicians] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [selectedTech, setSelectedTech] = useState<any>(null);
    const [actionLoading, setActionLoading] = useState(false);

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

    const handleUpdateStatus = async (techId: string, status: "approved" | "rejected") => {
        if (!user) return;
        setActionLoading(true);
        try {
            const token = await user.getIdToken();
            const result = await approveTechnician(techId, status, token);

            if (result.success) {
                setTechnicians(prev => prev.map(t => t.id === techId ? { ...t, status } : t));
                setSelectedTech(null);
            } else {
                alert("Failed to update status: " + result.error);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
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
                <h2 className="text-3xl font-bold tracking-tight">Technicians</h2>
                <p className="text-muted-foreground">Manage technician onboarding requests and approvals</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Applications List</CardTitle>
                    <CardDescription>View and manage technician applications</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {technicians.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No technician applications found.</p>
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
                    </DialogHeader>
                    {selectedTech && (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarFallback className="text-2xl">{selectedTech.fullName?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-2xl font-bold">{selectedTech.fullName}</h3>
                                    <p className="text-gray-500">{selectedTech.email}</p>
                                    <p className="text-sm text-gray-400">{selectedTech.phone}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Professional Info</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Category:</span>
                                            <span className="font-medium capitalize">{selectedTech.category}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Experience:</span>
                                            <span className="font-medium">{selectedTech.experience} years</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Location:</span>
                                            <span className="font-medium">{selectedTech.city}, {selectedTech.state}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Documents</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <div className="flex items-center space-x-2">
                                                <FileText className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm">ID Proof</span>
                                            </div>
                                            <Button variant="ghost" size="sm" asChild>
                                                <a href={selectedTech.idProofUrl} target="_blank" rel="noopener noreferrer">View</a>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-semibold">Bio</h4>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">{selectedTech.bio}</p>
                            </div>

                            <DialogFooter className="gap-2">
                                {selectedTech.status === "pending" && (
                                    <>
                                        <Button variant="destructive" onClick={() => handleUpdateStatus(selectedTech.id, "rejected")} disabled={actionLoading}>
                                            Reject Application
                                        </Button>
                                        <Button onClick={() => handleUpdateStatus(selectedTech.id, "approved")} disabled={actionLoading}>
                                            Approve Technician
                                        </Button>
                                    </>
                                )}
                                {selectedTech.status === "approved" && (
                                    <Button variant="destructive" onClick={() => handleUpdateStatus(selectedTech.id, "rejected")} disabled={actionLoading}>
                                        Revoke Approval
                                    </Button>
                                )}
                                {selectedTech.status === "rejected" && (
                                    <Button variant="outline" onClick={() => handleUpdateStatus(selectedTech.id, "approved")} disabled={actionLoading}>
                                        Re-Approve
                                    </Button>
                                )}
                                {selectedTech.status === "rejected" && (
                                    <Button variant="outline" onClick={() => handleUpdateStatus(selectedTech.id, "approved")} disabled={actionLoading}>
                                        Re-Approve
                                    </Button>
                                )}
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div >
    );
}
