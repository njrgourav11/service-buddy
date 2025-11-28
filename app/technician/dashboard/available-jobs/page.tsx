"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAvailableJobs, acceptJob } from "@/actions/technician";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Loader2 } from "lucide-react";

export default function TechnicianAvailableJobsPage() {
    const { user, loading: authLoading } = useAuth();
    const [availableJobs, setAvailableJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [acceptingJobId, setAcceptingJobId] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            if (user) {
                try {
                    const token = await user.getIdToken();
                    const availableRes = await getAvailableJobs(token);
                    if (availableRes.success) {
                        setAvailableJobs(availableRes.jobs || []);
                    }
                } catch (error) {
                    console.error("Error fetching available jobs:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (!authLoading) {
            fetchJobs();
        }
    }, [user, authLoading]);

    const handleAcceptJob = async (jobId: string) => {
        if (!user) return;
        setAcceptingJobId(jobId);
        try {
            const token = await user.getIdToken();
            const result = await acceptJob(jobId, token);

            if (result.success) {
                setAvailableJobs(prev => prev.filter(job => job.id !== jobId));
            } else {
                alert("Failed to accept job: " + result.error);
            }
        } catch (error) {
            console.error("Error accepting job:", error);
            alert("Failed to accept job. Please try again.");
        } finally {
            setAcceptingJobId(null);
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
        <div className="grid gap-6">
            {availableJobs.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No New Jobs</h3>
                        <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                            There are currently no new jobs available. Please check back later.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                availableJobs.map((job) => (
                    <Card key={job.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{job.serviceName}</CardTitle>
                                    <CardDescription className="mt-1 flex items-center">
                                        <MapPin className="h-4 w-4 mr-1" /> {job.address}
                                    </CardDescription>
                                </div>
                                <Badge variant="outline" className="text-lg font-bold">₹{job.amount}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500 block">Date</span>
                                    <span className="font-medium">{new Date(job.date).toLocaleDateString()}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Payment</span>
                                    <span className="font-medium capitalize">{job.paymentMethod} ({job.paymentStatus})</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleAcceptJob(job.id)}
                                disabled={acceptingJobId === job.id}
                            >
                                {acceptingJobId === job.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Accept Job"}
                            </Button>
                        </CardFooter>
                    </Card>
                ))
            )}
        </div>
    );
}
