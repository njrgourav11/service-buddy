"use client"
import React, { useState, useEffect } from "react";
import {
    ChevronDown,
    ChevronsRight,
    Moon,
    Sun,
    User,
    LogOut,
    Menu,
    LayoutDashboard,
    Wrench
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationBell } from "@/components/notification-bell";

import { usePathname } from "next/navigation";

interface SidebarItem {
    icon: any;
    label: string;
    id: string;
    notifs?: number;
    href?: string;
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    sidebarItems: SidebarItem[];
    activeTab?: string;
    onTabChange?: (id: string) => void;
    user: any;
    role: string;
    title?: string;
    isAdmin?: boolean;
}

export const DashboardLayout = ({
    children,
    sidebarItems,
    activeTab,
    onTabChange,
    user,
    role,
    title = "Dashboard",
    isAdmin = false
}: DashboardLayoutProps) => {
    const { theme, setTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSwitcherOpen, setIsSwitcherOpen] = useState(true);
    const { logout } = useAuth();
    const pathname = usePathname();

    // Handle system theme preference on mount
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

    // Reusable Theme Toggle
    const ThemeToggle = () => (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            title="Toggle Theme"
        >
            {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
    );

    const SidebarContent = ({ open = true }: { open?: boolean }) => (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
            {/* Title Section */}
            <div className={`p-4 border-b border-gray-200 dark:border-gray-800 ${open ? '' : 'flex justify-center'}`}>
                <div className="flex items-center gap-3">
                    <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
                        <Wrench className="h-6 w-6 text-white" />
                    </div>
                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden whitespace-nowrap"
                            >
                                <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    ServiceBuddy
                                </span>
                                <span className="block text-xs text-gray-500 dark:text-gray-400 capitalize">
                                    {role} Panel
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 py-4 space-y-1 overflow-y-auto px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {sidebarItems.map((item) => {
                    const isSelected = item.href ? pathname === item.href : activeTab === item.id;

                    const content = (
                        <>
                            <div className="grid h-full w-12 place-content-center shrink-0">
                                <item.icon className="h-5 w-5" />
                            </div>

                            <AnimatePresence>
                                {open && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-sm font-medium truncate overflow-hidden whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {item.notifs && open && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 dark:bg-blue-600 text-xs text-white font-medium"
                                >
                                    {item.notifs}
                                </motion.span>
                            )}
                        </>
                    );

                    const className = `relative flex h-11 w-full items-center rounded-md transition-all duration-200 group ${isSelected
                        ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shadow-sm border-l-2 border-blue-500"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                        }`;

                    if (item.href) {
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={className}
                                title={!open ? item.label : undefined}
                            >
                                {content}
                            </Link>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                if (onTabChange) onTabChange(item.id);
                                setIsSidebarOpen(false);
                            }}
                            className={className}
                            title={!open ? item.label : undefined}
                        >
                            {content}
                        </button>
                    );
                })}
            </div>

            {/* Dashboard Switcher (Admin Only) */}
            {(role === 'admin' || isAdmin) && (
                <div className="px-2 py-2 border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                        className={`flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors ${!open ? 'justify-center' : ''}`}
                        title={!open ? "Switch Dashboard" : undefined}
                    >
                        <AnimatePresence mode="wait">
                            {open ? (
                                <motion.span
                                    key="text"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    Switch Dashboard
                                </motion.span>
                            ) : null}
                        </AnimatePresence>

                        {open && (
                            <ChevronDown className={`h-3 w-3 transition-transform ${isSwitcherOpen ? 'rotate-180' : ''}`} />
                        )}
                        {!open && <LayoutDashboard className="h-4 w-4" />}
                    </button>

                    {/* Collapsible Content */}
                    <motion.div
                        initial={false}
                        animate={{
                            height: (isSwitcherOpen || !open) ? "auto" : 0,
                            opacity: (isSwitcherOpen || !open) ? 1 : 0
                        }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-1 mt-1">
                            {[
                                { label: "Admin", href: "/admin/dashboard", icon: LayoutDashboard },
                                { label: "Manager", href: "/manager/dashboard", icon: User },
                                { label: "Technician", href: "/technician/dashboard", icon: Menu },
                            ].map((dash) => (
                                <Link
                                    key={dash.label}
                                    href={dash.href}
                                    className={`flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname.startsWith(dash.href) ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-400'
                                        } ${!open ? 'justify-center' : ''}`}
                                    title={!open ? `${dash.label} Dashboard` : undefined}
                                >
                                    <dash.icon className="h-4 w-4 shrink-0" />
                                    <AnimatePresence>
                                        {open && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: "auto" }}
                                                exit={{ opacity: 0, width: 0 }}
                                                className="truncate"
                                            >
                                                {dash.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Utilities & Footer */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-800 space-y-2">
                {/* Utilities: Theme & Notifications */}
                <div className={`flex items-center ${open ? 'justify-between px-2' : 'flex-col gap-2'}`}>
                    <ThemeToggle />
                    <NotificationBell />
                </div>

                {/* User Profile */}
                {open ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
                                <Avatar className="h-9 w-9 border border-gray-200 dark:border-gray-700">
                                    <AvatarImage src={user?.photoURL || ""} />
                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                        {user?.displayName?.[0] || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {user?.displayName || "User"}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {user?.email}
                                    </p>
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/profile">
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => logout()}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span className="text-red-600">Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="flex justify-center">
                        <Avatar className="h-9 w-9 border border-gray-200 dark:border-gray-700 cursor-pointer" onClick={() => onTabChange && onTabChange('profile')}>
                            <AvatarImage src={user?.photoURL || ""} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                {user?.displayName?.[0] || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: desktopSidebarOpen ? 256 : 64 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden lg:flex flex-col sticky top-0 h-screen shrink-0 z-20 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
            >
                {/* Sidebar Content Wrapper */}
                <div className="flex-1 overflow-hidden w-full">
                    <SidebarContent open={desktopSidebarOpen} />
                </div>

                {/* Collapse Button */}
                <button
                    onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
                    className="h-12 border-t border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 w-full flex items-center justify-center shrink-0"
                >
                    <div className={`flex items-center ${desktopSidebarOpen ? 'px-3 w-full' : 'justify-center'}`}>
                        <ChevronsRight
                            className={`h-4 w-4 transition-transform duration-300 text-gray-500 dark:text-gray-400 ${desktopSidebarOpen ? "rotate-180" : ""
                                }`}
                        />
                        <AnimatePresence>
                            {desktopSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="ml-3 text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap overflow-hidden"
                                >
                                    Collapse
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </button>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64">
                                <SidebarContent open={true} />
                            </SheetContent>
                        </Sheet>
                        <span className="font-bold text-lg">ServiceBuddy</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <NotificationBell />
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.photoURL || ""} />
                            <AvatarFallback>{user?.displayName?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};
