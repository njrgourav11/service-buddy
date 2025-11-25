"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, CheckCircle2, AlertCircle, Calendar, MapPin } from "lucide-react";

export default function TechnicianDashboard() {
    // Mock status: "pending", "approved"
    const status = "pending";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Partner Dashboard</h1>
                    <Button variant="outline" asChild>
                        <Link href="/profile">My Profile</Link>
                    </Button>
                </div>

                {status === "pending" && (
                    <Alert className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                        <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        <AlertTitle className="text-yellow-800 dark:text-yellow-300">Application Under Review</AlertTitle>
                        <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                            Your profile is currently being verified by our team. This usually takes 24-48 hours. You will be notified once approved.
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
        </div>
    );
}
