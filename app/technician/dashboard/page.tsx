"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle2, AlertCircle, Calendar, MapPin, Loader2, DollarSign } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";

export default function TechnicianDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [availableJobs, setAvailableJobs] = useState<any[]>([]);
    const [myJobs, setMyJobs] = useState<any[]>([]);
    const [acceptingJobId, setAcceptingJobId] = useState<string | null>(null);

    useEffect(() => {
        const fetchTechnicianStatus = async () => {
            if (user) {
                try {
                    const q = query(collection(db, "technicians"), where("userId", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        setStatus(querySnapshot.docs[0].data().status);
                    } else {
                        setStatus(null); // Not applied yet
                    }
                } catch (error) {
                    console.error("Error fetching technician status:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchTechnicianStatus();
        }
    }, [user, authLoading]);

    useEffect(() => {
        const fetchJobs = async () => {
            if (status === "approved" && user) {
                try {
                    // Fetch Available Jobs (pending status)
                    // In a real app, you might filter by city or category here
                    const availableQ = query(collection(db, "bookings"), where("status", "==", "confirmed"), where("paymentStatus", "==", "paid"));
                    // Assuming 'confirmed' means booked by user but not assigned. 
                    // Let's adjust: 'confirmed' = booked, 'accepted' = assigned.
                    // Actually, let's look for bookings where technicianId is missing or status is 'confirmed'

                    const availableSnap = await getDocs(query(collection(db, "bookings"), where("status", "==", "confirmed")));
                    const availableData = availableSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setAvailableJobs(availableData);

                    // Fetch My Jobs (accepted by this technician)
                    const myJobsQ = query(collection(db, "bookings"), where("technicianId", "==", user.uid));
                    const myJobsSnap = await getDocs(myJobsQ);
                    const myJobsData = myJobsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setMyJobs(myJobsData);

                } catch (error) {
                    console.error("Error fetching jobs:", error);
                }
            }
        };

        fetchJobs();
    }, [status, user]);

    const handleAcceptJob = async (jobId: string) => {
        if (!user) return;
        setAcceptingJobId(jobId);
        try {
            // 1. Update booking status and assign technician
            const bookingRef = doc(db, "bookings", jobId);

            // Get technician details to store in booking (optional, but helpful for quick display)
            const techDoc = await getDocs(query(collection(db, "technicians"), where("userId", "==", user.uid)));
            const techData = techDoc.docs[0].data();

            await updateDoc(bookingRef, {
                status: "accepted",
                technicianId: user.uid,
                technicianName: techData.fullName,
                technicianPhone: techData.phone
            });

            // 2. Update local state
            const acceptedJob = availableJobs.find(job => job.id === jobId);
            if (acceptedJob) {
                setAvailableJobs(prev => prev.filter(job => job.id !== jobId));
                setMyJobs(prev => [...prev, { ...acceptedJob, status: "accepted", technicianId: user.uid }]);
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
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Please Login</h1>
                <Button asChild>
                    <Link href="/auth/login">Login</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Partner Dashboard</h1>
                    <Button variant="outline" asChild>
                        <Link href="/profile">My Profile</Link>
                    </Button>
                </div>

                {!status && (
                    <Alert className="mb-8">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Not Registered</AlertTitle>
                        <AlertDescription>
                            You haven't registered as a partner yet. <Link href="/technician/onboarding" className="underline font-bold">Register Now</Link>
                        </AlertDescription>
                    </Alert>
                )}

                {status === "pending" && (
                    <Alert className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                        <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        <AlertTitle className="text-yellow-800 dark:text-yellow-300">Application Under Review</AlertTitle>
                        <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                            Your profile is currently being verified by our team. This usually takes 24-48 hours. You will be notified once approved.
                        </AlertDescription>
                    </Alert>
                )}

                {status === "rejected" && (
                    <Alert className="mb-8 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <AlertTitle className="text-red-800 dark:text-red-300">Application Rejected</AlertTitle>
                        <AlertDescription className="text-red-700 dark:text-red-400">
                            Unfortunately, your application was not approved. Please contact support for more details.
                        </AlertDescription>
                    </Alert>
                )}

                {status === "approved" && (
                    <Tabs defaultValue="overview" className="space-y-8">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="available">Available Jobs ({availableJobs.length})</TabsTrigger>
                            <TabsTrigger value="my-jobs">My Jobs ({myJobs.length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview">
                            <Alert className="mb-8 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <AlertTitle className="text-green-800 dark:text-green-300">Active Partner</AlertTitle>
                                <AlertDescription className="text-green-700 dark:text-green-400">
                                    You are now an active partner. Check the "Available Jobs" tab to start working.
                                </AlertDescription>
                            </Alert>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                                        <span className="text-2xl font-bold">₹0</span>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xs text-muted-foreground">+0% from last month</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                                        <span className="text-2xl font-bold">0</span>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xs text-muted-foreground">+0% from last month</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Rating</CardTitle>
                                        <span className="text-2xl font-bold">-</span>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xs text-muted-foreground">No ratings yet</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="available">
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
                        </TabsContent>

                        <TabsContent value="my-jobs">
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
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    );
}
