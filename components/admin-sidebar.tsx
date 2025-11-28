"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Calendar, Settings, FileText, Shield } from "lucide-react"

const sidebarItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Bookings", href: "/admin/bookings", icon: Calendar },
    { name: "Services", href: "/admin/services", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar({ className, onLinkClick }: { className?: string, onLinkClick?: () => void }) {
    const pathname = usePathname()

    return (
        <div className={cn("pb-12 h-full bg-white dark:bg-gray-900", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center px-4 mb-6">
                        <Shield className="h-6 w-6 text-blue-600 mr-2" />
                        <h2 className="text-lg font-bold tracking-tight">
                            Admin Portal
                        </h2>
                    </div>
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.href}
                                variant={pathname === item.href ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start",
                                    pathname === item.href && "bg-gray-100 dark:bg-gray-800"
                                )}
                                asChild
                                onClick={onLinkClick}
                            >
                                <Link href={item.href}>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.name}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
