"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import {
    LayoutDashboard,
    Users,
    Calendar,
    Package,
    Briefcase,
    Activity,
    Loader2
} from "lucide-react";
import { getAdminStats } from "@/actions/admin";
import NoPermission from "@/components/NoPermission";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, role, loading: authLoading } = useAuth();
    const [pendingTechs, setPendingTechs] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (user && role === "admin") {
                try {
                    const token = await user.getIdToken();
                    const result = await getAdminStats(token);
                    if (result.success && result.data && result.data.technicians) {
                        const pending = result.data.technicians.filter((t: any) => t.status === "pending").length;
                        setPendingTechs(pending);
                    }
                } catch (error) {
                    console.error("Error fetching admin stats:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchStats();
        }
    }, [user, role, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user || role !== "admin") {
        return <NoPermission />;
    }

    const sidebarItems = [
        { icon: LayoutDashboard, label: "Overview", id: "overview", href: "/admin/dashboard" },
        { icon: Calendar, label: "Bookings", id: "bookings", href: "/admin/bookings" },
        { icon: Package, label: "Services", id: "services", href: "/admin/services" },
        { icon: Briefcase, label: "Technicians", id: "technicians", href: "/admin/technicians", notifs: pendingTechs },
        { icon: Users, label: "Users", id: "users", href: "/admin/users" },
        { icon: Activity, label: "System Logs", id: "logs", href: "/admin/logs" },
    ];

    return (
        <DashboardLayout
            sidebarItems={sidebarItems}
            user={user}
            role="admin"
            title="Admin Dashboard"
            isAdmin={true}
        >
            {children}
        </DashboardLayout>
    );
}
