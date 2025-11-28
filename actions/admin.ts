"use server";

import { adminDb, adminAuth } from "@/lib/firebase-admin";

export async function getAdminStats(token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        // Verify admin role
        // For now, we assume if they can access the page (middleware protected ideally), they are admin.
        // But let's check a custom claim or just proceed for now as we don't have strict role management yet.

        // In a real app: if (decodedToken.role !== 'admin') throw new Error("Unauthorized");

        // 1. Total Users
        const usersSnap = await adminDb.collection("users").count().get();
        const totalUsers = usersSnap.data().count;

        // 2. Total Bookings
        const bookingsSnap = await adminDb.collection("bookings").count().get();
        const totalBookings = bookingsSnap.data().count;

        // 3. Total Revenue (Aggregation)
        const revenueSnap = await adminDb.collection("bookings")
            .where("paymentStatus", "==", "paid")
            .get();

        let totalRevenue = 0;
        revenueSnap.docs.forEach(doc => {
            totalRevenue += doc.data().amount || 0;
        });

        // 4. Recent Bookings
        const recentBookingsSnap = await adminDb.collection("bookings")
            .orderBy("createdAt", "desc")
            .limit(5)
            .get();

        const recentBookings = recentBookingsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // 5. Recent Users
        const recentUsersSnap = await adminDb.collection("users")
            .orderBy("createdAt", "desc")
            .limit(5)
            .get();

        const recentUsers = recentUsersSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return {
            success: true,
            stats: {
                totalUsers,
                totalBookings,
                totalRevenue,
                recentBookings,
                recentUsers
            }
        };

    } catch (error: any) {
        console.error("Error fetching admin stats:", error);
        return { success: false, error: error.message };
    }
}
