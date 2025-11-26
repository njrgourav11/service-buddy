"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { getNotifications, markAsRead, Notification } from "@/actions/notification";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NotificationBell() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            const result = await getNotifications(token);
            if (result.success && result.notifications) {
                setNotifications(result.notifications);
                setUnreadCount(result.notifications.filter(n => !n.read).length);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll every minute
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleMarkAsRead = async (notification: Notification) => {
        if (notification.read || !user) return;
        try {
            const token = await user.getIdToken();
            await markAsRead(notification.id, token);
            setNotifications(prev =>
                prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    if (!user) return null;

    return (
        <DropdownMenu open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (open) fetchNotifications();
        }}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-[400px] overflow-y-auto">
                <DropdownMenuLabel className="flex justify-between items-center">
                    <span>Notifications</span>
                    {unreadCount > 0 && <Badge variant="destructive" className="text-xs">{unreadCount} New</Badge>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                        No notifications
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <DropdownMenuItem
                            key={notification.id}
                            className={cn(
                                "flex flex-col items-start p-3 cursor-pointer focus:bg-gray-50 dark:focus:bg-gray-800",
                                !notification.read && "bg-blue-50 dark:bg-blue-900/20"
                            )}
                            onClick={() => handleMarkAsRead(notification)}
                        >
                            <div className="flex justify-between w-full mb-1">
                                <span className={cn("font-medium text-sm", !notification.read && "text-blue-600 dark:text-blue-400")}>
                                    {notification.title}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(notification.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                                {notification.message}
                            </p>
                            {notification.link && (
                                <Link href={notification.link} className="text-xs text-blue-500 hover:underline w-full text-right block" onClick={(e) => e.stopPropagation()}>
                                    View Details
                                </Link>
                            )}
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
