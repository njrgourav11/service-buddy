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
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                <p className="text-muted-foreground">Welcome back, here's your performance summary.</p>
            </div>
            {!status && (
                <Alert className="mb-8">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Not Registered</AlertTitle>
                    <AlertDescription>
                        You have not completed your registration yet. Please <Link href="/join/technician" className="underline font-medium">complete your profile</Link> to start accepting jobs.
                    </AlertDescription>
                </Alert>
            )}

            {status === "pending" && (
                <Alert className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                    <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <AlertTitle className="text-yellow-800 dark:text-yellow-300">Application Pending</AlertTitle>
                    <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                        Your application is currently under review by an administrator. You will be notified once it is approved.
                    </AlertDescription>
                </Alert>
            )}

            {status === "rejected" && (
                <Alert className="mb-8 variant-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Application Rejected</AlertTitle>
                    <AlertDescription>
                        Unfortunately, your application has been rejected. Please contact support for more information.
                    </AlertDescription>
                </Alert>
            )}

            {status === "approved" && stats && (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹{stats.totalEarnings}</div>
                                <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.completedJobs}</div>
                                <p className="text-xs text-muted-foreground">Successfully completed</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.pendingJobs}</div>
                                <p className="text-xs text-muted-foreground">Jobs in progress</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Weekly Earnings</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={stats.weeklyEarnings}>
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `₹${value}`}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
