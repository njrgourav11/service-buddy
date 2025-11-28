"use server";

import { adminDb, adminAuth } from "@/lib/firebase-admin";

export async function getDetailedMetrics(token: string) {
    try {
        await adminAuth.verifyIdToken(token);

        // 1. Revenue Over Time (Last 12 months)
        const revenueData = new Array(12).fill(0).map((_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            return {
                name: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
                revenue: 0,
                month: d.getMonth(),
                year: d.getFullYear()
            };
        }).reverse();

        const bookingsSnap = await adminDb.collection("bookings")
            .where("paymentStatus", "==", "paid")
            .get();

        bookingsSnap.docs.forEach(doc => {
            const data = doc.data();
            const date = new Date(data.createdAt); // or paymentDate
            const month = date.getMonth();
            const year = date.getFullYear();

            const monthStat = revenueData.find(m => m.month === month && m.year === year);
            if (monthStat) {
                monthStat.revenue += data.amount || 0;
            }
        });

        // 2. Booking Status Distribution
        const statusDistribution = {
            pending: 0,
            confirmed: 0,
            completed: 0,
            cancelled: 0
        };

        const allBookingsSnap = await adminDb.collection("bookings").get();
        allBookingsSnap.docs.forEach(doc => {
            const status = doc.data().status as keyof typeof statusDistribution;
            if (statusDistribution[status] !== undefined) {
                statusDistribution[status]++;
            }
        });

        // 3. Top Services
        const serviceCounts: Record<string, number> = {};
        allBookingsSnap.docs.forEach(doc => {
            const serviceName = doc.data().serviceName;
            if (serviceName) {
                serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
            }
        });

        const topServices = Object.entries(serviceCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return {
            success: true,
            metrics: {
                revenueData,
                statusDistribution: [
                    { name: 'Pending', value: statusDistribution.pending },
                    { name: 'Confirmed', value: statusDistribution.confirmed },
                    { name: 'Completed', value: statusDistribution.completed },
                    { name: 'Cancelled', value: statusDistribution.cancelled },
                ],
                topServices
            }
        };

    } catch (error: any) {
        console.error("Error fetching metrics:", error);
        return { success: false, error: error.message };
    }
}
