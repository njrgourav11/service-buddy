"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, CheckCircle2, AlertCircle, Calendar, MapPin, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function TechnicianDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

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
                    <Alert className="mb-8 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertTitle className="text-green-800 dark:text-green-300">Active Partner</AlertTitle>
                        <AlertDescription className="text-green-700 dark:text-green-400">
                            You are now an active partner. You can start accepting jobs.
                        </AlertDescription>
                    </Alert>
                )}

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

                {status === "approved" ? (
                    <>
                        <h2 className="text-xl font-bold mb-4">Upcoming Jobs</h2>
                        <Card className="text-center py-12">
                            <CardContent>
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Upcoming Jobs</h3>
                                <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                                    You will start receiving job requests here.
                                </p>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <div className="opacity-50 pointer-events-none grayscale">
                        <h2 className="text-xl font-bold mb-4">Upcoming Jobs</h2>
                        <Card className="text-center py-12">
                            <CardContent>
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Upcoming Jobs</h3>
                                <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                                    Once your profile is approved, you will start receiving job requests here.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
