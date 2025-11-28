"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAdminStats } from "@/actions/admin";

interface AdminData {
    stats?: any;
    bookings?: any[];
    technicians?: any[];
    users?: any[];
}

export function useAdminData() {
    const { user, loading: authLoading } = useAuth();
    const [data, setData] = useState<AdminData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        if (user) {
            try {
                setLoading(true);
                const token = await user.getIdToken(true);
                const result = await getAdminStats(token);

                if (result.success) {
                    setData({
                        stats: result.stats,
                        bookings: result.data?.bookings || [],
                        technicians: result.data?.technicians || [],
                        users: result.data?.users || [],
                    });
                } else {
                    setError(result.error || "Failed to fetch data");
                }
            } catch (err) {
                console.error("Error fetching admin data:", err);
                setError("An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (!authLoading) {
            fetchData();
        }
    }, [user, authLoading]);

    return { data, loading, error, refetch: fetchData };
}
