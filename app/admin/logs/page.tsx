
"use client";

                        import {useState, useEffect} from "react";
                        import {useAuth} from "@/context/AuthContext";
                        import {getSystemLogs} from "@/actions/logger";
                        import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
                        import {Badge} from "@/components/ui/badge";
                        import {Loader2} from "lucide-react";

                        export default function AdminLogsPage() {
    const {user, loading: authLoading } = useAuth();
                        const [logs, setLogs] = useState<any[]>([]);
                        const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                            setLoading(true);
                        const token = await user.getIdToken(true);
                        const result = await getSystemLogs(token);

                        if (result.success) {
                            setLogs(result.logs || []);
                    }
                } catch (error) {
                            console.error("Error fetching logs:", error);
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
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">System Logs</h2>
                                <p className="text-muted-foreground">View system activity and audit trails</p>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Logs</CardTitle>
                                    <CardDescription>Recent system activities</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {logs.length === 0 ? (
                                            <p className="text-gray-500 text-center py-8">No logs found.</p>
                                        ) : (
                                            <div className="rounded-md border overflow-hidden">
                                                <div className="bg-gray-50 dark:bg-gray-900 p-3 border-b text-xs font-medium text-gray-500 uppercase tracking-wider grid grid-cols-12 gap-2">
                                                    <div className="col-span-2">Time</div>
                                                    <div className="col-span-2">User</div>
                                                    <div className="col-span-2">Action</div>
                                                    <div className="col-span-6">Description</div>
                                                </div>
                                                <div className="divide-y divide-gray-200 dark:divide-gray-800 max-h-[500px] overflow-y-auto">
                                                    {logs.map((log) => (
                                                        <div key={log.id} className="p-3 text-sm grid grid-cols-12 gap-2 items-center hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                                            <div className="col-span-2 text-gray-500 text-xs">
                                                                {new Date(log.timestamp).toLocaleString()}
                                                            </div>
                                                            <div className="col-span-2 font-medium truncate" title={log.userName}>
                                                                {log.userName || "System"}
                                                            </div>
                                                            <div className="col-span-2">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {log.action}
                                                                </Badge>
                                                            </div>
                                                            <div className="col-span-6 text-gray-600 dark:text-gray-300 truncate" title={log.description}>
                                                                {log.description}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        );
}
