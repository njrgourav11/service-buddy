"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getTechnicianStatus, getTechnicianStats } from "@/actions/technician";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, CheckCircle2, AlertCircle, DollarSign, Loader2 } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function TechnicianOverviewPage() {
    const { user, loading: authLoading } = useAuth();
    const [status, setStatus] = useState<string | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    const token = await user.getIdToken();
                    const statusRes = await getTechnicianStatus(token);
                    if (statusRes.success) {
                        setStatus(statusRes.status);

                        if (statusRes.status === "approved") {
                            const statsRes = await getTechnicianStats(token);
                            if (statsRes.success) setStats(statsRes.stats);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching technician data:", error);
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
        <div className="space-y-8">
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
                <>
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
                                <span className="text-2xl font-bold">₹{stats?.totalEarnings || 0}</span>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                                <span className="text-2xl font-bold">{stats?.completedJobs || 0}</span>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">Successfully delivered</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Rating</CardTitle>
                                <span className="text-2xl font-bold">{stats?.rating?.toFixed(1) || "-"}</span>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <DollarSign key={star} className={`h-3 w-3 ${star <= (stats?.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Earnings Chart */}
                    {stats?.monthlyEarnings && (
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>Earnings Overview</CardTitle>
                                <CardDescription>Monthly earnings for the last 6 months</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.monthlyEarnings}>
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                            <XAxis dataKey="name" className="text-xs text-muted-foreground" />
                                            <YAxis className="text-xs text-muted-foreground" tickFormatter={(value) => `₹${value}`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                                                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                                            />
                                            <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}
