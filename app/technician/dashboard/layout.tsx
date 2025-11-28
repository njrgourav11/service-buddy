"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { LayoutDashboard, Briefcase, Calendar, Loader2 } from "lucide-react";
import { getTechnicianStatus, getAvailableJobs, getMyJobs } from "@/actions/technician";

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
    const { user, role, loading: authLoading } = useAuth();
    const [status, setStatus] = useState<string | null>(null);
    const [availableCount, setAvailableCount] = useState(0);
    const [myJobsCount, setMyJobsCount] = useState(0);
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
                            const availableRes = await getAvailableJobs(token);
                            if (availableRes.success) setAvailableCount(availableRes.jobs?.length || 0);

                            const myJobsRes = await getMyJobs(token);
                            if (myJobsRes.success) setMyJobsCount(myJobsRes.jobs?.length || 0);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching technician data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchData();
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const sidebarItems = status === "approved" ? [
        { icon: LayoutDashboard, label: "Overview", id: "overview", href: "/technician/dashboard/overview" },
        { icon: Briefcase, label: "Available Jobs", id: "available", href: "/technician/dashboard/available-jobs", notifs: availableCount },
        { icon: Calendar, label: "My Jobs", id: "my-jobs", href: "/technician/dashboard/my-jobs", notifs: myJobsCount },
    ] : [
        { icon: LayoutDashboard, label: "Overview", id: "overview", href: "/technician/dashboard/overview" },
    ];

    return (
        <DashboardLayout
            sidebarItems={sidebarItems}
            user={user}
            role="Technician"
            title="Partner Dashboard"
            isAdmin={role === "admin"}
        >
            {children}
        </DashboardLayout>
    );
}
