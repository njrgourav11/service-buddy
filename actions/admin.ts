"use server";

import { adminDb, adminAuth } from "@/lib/firebase-admin";

export async function getAdminStats(token: string) {
    try {
        await verifyAdmin(token);

        // 1. Fetch all data in parallel
        const [usersSnap, bookingsSnap, techniciansSnap] = await Promise.all([
            adminDb.collection("users").orderBy("createdAt", "desc").get(),
            adminDb.collection("bookings").orderBy("createdAt", "desc").get(),
            adminDb.collection("technicians").orderBy("joinedAt", "desc").get()
        ]);

        // 2. Process Users
        const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const totalUsers = users.length;

        // 3. Process Bookings & Revenue
        const bookings = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((acc, booking: any) => {
            const isPaidOrPending = booking.paymentStatus === 'paid' || booking.paymentStatus === 'pending_verification';
            const amount = Number(booking.amount) || 0;
            return acc + (isPaidOrPending ? amount : 0);
        }, 0);

        // 4. Process Technicians
        const technicians = techniciansSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const activeTechnicians = technicians.filter((t: any) => t.status === 'approved').length;

        return {
            success: true,
            stats: {
                totalUsers,
                totalBookings,
                totalRevenue,
                activeTechnicians
            },
            data: {
                users,
                bookings,
                technicians
            }
        };

    } catch (error: any) {
        console.error("Error fetching admin stats:", error);
        return { success: false, error: error.message };
    }
}

export async function getAllUsers(token: string) {
    try {
        await verifyAdmin(token);

        const usersSnap = await adminDb.collection("users").orderBy("createdAt", "desc").get();
        const users = usersSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, users };
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return { success: false, error: error.message };
    }
}

export async function assignTechnician(bookingId: string, technicianId: string, token: string) {
    try {
        await verifyAdmin(token);

        const techDoc = await adminDb.collection("technicians").doc(technicianId).get();
        if (!techDoc.exists) throw new Error("Technician not found");
        const techData = techDoc.data();

        if (techData?.status !== "approved") {
            throw new Error("Technician is not approved");
        }

        // Check booking status
        const bookingRef = adminDb.collection("bookings").doc(bookingId);
        const bookingDoc = await bookingRef.get();
        if (!bookingDoc.exists) throw new Error("Booking not found");

        const bookingData = bookingDoc.data();
        if (bookingData?.status === "completed" || bookingData?.status === "cancelled") {
            throw new Error("Cannot assign technician to a completed or cancelled booking");
        }

        await bookingRef.update({
            technicianId,
            technicianName: techData?.fullName,
            technicianPhone: techData?.phone || "",
            status: "assigned",
            updatedAt: new Date().toISOString()
        });

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateUserRole(userId: string, role: string, token: string) {
    try {
        await verifyAdmin(token);

        await adminDb.collection("users").doc(userId).update({ role });
        await adminAuth.setCustomUserClaims(userId, { role });

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function approveTechnician(technicianId: string, status: "approved" | "rejected", token: string) {
    try {
        await verifyAdmin(token);

        await adminDb.collection("technicians").doc(technicianId).update({
            status,
            updatedAt: new Date().toISOString()
        });

        if (status === "approved") {
            // Also update user role to technician if not already
            const techDoc = await adminDb.collection("technicians").doc(technicianId).get();
            const userId = techDoc.data()?.userId;
            if (userId) {
                await adminDb.collection("users").doc(userId).update({ role: "technician" });
                await adminAuth.setCustomUserClaims(userId, { role: "technician" });
            }
        }

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Helper function to verify admin
export async function verifyAdmin(token: string) {
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Check for custom claim 'role' or 'admin' property
    if (decodedToken.role !== 'admin' && decodedToken.admin !== true) {
        throw new Error("Unauthorized: Admin access required");
    }
    return decodedToken;
}
