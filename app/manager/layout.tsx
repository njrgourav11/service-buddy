"use client";

import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Calendar, Briefcase, Loader2, LayoutDashboard } from "lucide-react";
import NoPermission from "@/components/NoPermission";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
    const { user, role, loading: authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user || (role !== "manager" && role !== "admin")) {
        return <NoPermission />;
    }

    const sidebarItems = [
        { icon: LayoutDashboard, label: "Overview", id: "overview", href: "/manager/overview" },
        { icon: Calendar, label: "Bookings", id: "bookings", href: "/manager/bookings" },
        { icon: Briefcase, label: "Technicians", id: "technicians", href: "/manager/technicians" },
    ];

    return (
        <DashboardLayout
            sidebarItems={sidebarItems}
            user={user}
            role="Manager"
            title="Manager Dashboard"
            isAdmin={role === "admin"}
        >
            {children}
        </DashboardLayout>
    );
}
