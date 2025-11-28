"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAdminStats, updateUserRole } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Loader2 } from "lucide-react";

export default function AdminUsersPage() {
    const { user, loading: authLoading } = useAuth();
    const [usersList, setUsersList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const token = await user.getIdToken(true);
                    const result = await getAdminStats(token);

                    if (result.success && result.data) {
                        setUsersList(result.data.users);
                    }
                } catch (error) {
                    console.error("Error fetching admin data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (!authLoading) {
            fetchData();
        }
    }, [user, authLoading]);

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        if (!user) return;
        if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

        try {
            const token = await user.getIdToken();
            const result = await updateUserRole(userId, newRole, token);
            if (result.success) {
                setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            } else {
                alert("Failed to update role: " + result.error);
            }
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Failed to update role");
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                <p className="text-muted-foreground">Manage user roles and permissions</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Registered Users</CardTitle>
                    <CardDescription>View and manage all registered users</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {usersList.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No users found.</p>
                        ) : (
                            usersList.map((u) => (
                                <div key={u.id} className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg gap-4">
                                    <div className="flex items-center space-x-4 w-full md:w-auto">
                                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <User className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{u.displayName || u.firstName + " " + u.lastName || "Unknown User"}</p>
                                            <p className="text-sm text-gray-500">{u.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
                                        <div className="flex flex-col items-end">
                                            <p className="text-xs text-gray-400 mb-1">
                                                Joined: {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                                            </p>
                                            <Select defaultValue={u.role || "user"} onValueChange={(val) => handleRoleUpdate(u.id, val)}>
                                                <SelectTrigger className="w-[120px] h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="user">User</SelectItem>
                                                    <SelectItem value="technician">Technician</SelectItem>
                                                    <SelectItem value="manager">Manager</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
