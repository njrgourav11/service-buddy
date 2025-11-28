"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Loader2, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
    const { user, loading: authLoading } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (authLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center p-4 border-b bg-white dark:bg-gray-900 sticky top-0 z-10">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="mr-2">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[280px] p-0">
                        <AdminSidebar onLinkClick={() => setMobileMenuOpen(false)} />
                    </SheetContent>
                </Sheet>
                <h1 className="text-lg font-bold">Admin Settings</h1>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 border-r bg-white dark:bg-gray-900 min-h-screen sticky top-0 h-screen overflow-y-auto">
                <AdminSidebar />
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">Settings</h1>
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Admin settings will go here.</p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
