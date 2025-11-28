"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMyJobs } from "@/actions/technician";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";

export default function TechnicianMyJobsPage() {
    const { user, loading: authLoading } = useAuth();
    const [myJobs, setMyJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            if (user) {
                try {
                    const token = await user.getIdToken();
                    const myJobsRes = await getMyJobs(token);
                    if (myJobsRes.success) {
                        setMyJobs(myJobsRes.jobs || []);
                    }
                } catch (error) {
                    console.error("Error fetching my jobs:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (!authLoading) {
            fetchJobs();
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
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">My Jobs</h2>
                <p className="text-muted-foreground">View and manage your accepted jobs.</p>
            </div>
            <div className="grid gap-6">
                {myJobs.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <p className="text-gray-500">You haven't accepted any jobs yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    myJobs.map((job) => (
                        <Card key={job.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{job.serviceName}</CardTitle>
                                        <CardDescription className="mt-1 flex items-center">
                                            <MapPin className="h-4 w-4 mr-1" /> {job.address}
                                        </CardDescription>
                                    </div>
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Accepted</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500 block">Date</span>
                                        <span className="font-medium">{new Date(job.date).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Amount</span>
                                        <span className="font-medium">₹{job.amount}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full">
                                    View Details
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
