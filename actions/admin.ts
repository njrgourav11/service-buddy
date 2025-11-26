"use server";

import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notification";

async function verifyAdmin(token: string) {
    const decodedToken = await adminAuth.verifyIdToken(token);
    // Check if user has admin role in Firestore or custom claims
    // For now, checking Firestore 'users' collection as per existing logic
    const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
    }
    return decodedToken;
}

export async function getAdminStats(token: string) {
    try {
        await verifyAdmin(token);

        // This can be optimized with aggregation queries or counters
        const bookingsSnap = await adminDb.collection("bookings").get();
        const techniciansSnap = await adminDb.collection("technicians").get();
        const usersSnap = await adminDb.collection("users").get();

        const totalRevenue = bookingsSnap.docs.reduce((acc, doc) => acc + (doc.data().amount || 0), 0);
        const activeTechs = techniciansSnap.docs.filter(doc => doc.data().status === "approved").length;

        const bookings = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const technicians = techniciansSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return {
            success: true,
            stats: {
                totalBookings: bookingsSnap.size,
                totalRevenue,
                activeTechnicians: activeTechs,
                totalUsers: usersSnap.size
            },
            data: {
                bookings,
                technicians,
                users
            }
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function approveTechnician(techId: string, status: "approved" | "rejected", token: string) {
    try {
        await verifyAdmin(token);

        await adminDb.collection("technicians").doc(techId).update({
            status,
            updatedAt: new Date().toISOString()
        });

        // Notify Technician
        const techDoc = await adminDb.collection("technicians").doc(techId).get();
        const techUserId = techDoc.data()?.userId;
        if (techUserId) {
            await createNotification(
                techUserId,
                `Application ${status === "approved" ? "Approved" : "Rejected"}`,
                `Your technician application has been ${status}.`,
                status === "approved" ? "success" : "error",
                "/technician/dashboard"
            );
        }

        revalidatePath("/admin");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function assignTechnician(bookingId: string, techId: string, token: string) {
    try {
        await verifyAdmin(token);

        const techDoc = await adminDb.collection("technicians").doc(techId).get();
        if (!techDoc.exists) throw new Error("Technician not found");
        const techData = techDoc.data();

        await adminDb.collection("bookings").doc(bookingId).update({
            technicianId: techId,
            technicianName: techData?.fullName || "Unknown",
            status: "assigned",
            updatedAt: new Date().toISOString()
        });

        // Notify Technician
        const techUserId = techData?.userId;
        if (techUserId) {
            await createNotification(
                techUserId,
                "New Job Assigned",
                `You have been assigned to a new job: ${bookingId}`,
                "info",
                "/technician/dashboard"
            );
        }

        revalidatePath("/admin");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getSystemLogs(token: string) {
    try {
        await verifyAdmin(token);
        const logsSnap = await adminDb.collection("system_logs")
            .orderBy("timestamp", "desc")
            .limit(100)
            .get();

        const logs = logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { success: true, logs };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateUserRole(userId: string, newRole: string, token: string) {
    try {
        await verifyAdmin(token);

        // Update in Firestore
        await adminDb.collection("users").doc(userId).update({
            role: newRole,
            updatedAt: new Date().toISOString()
        });

        // Update Custom Claims (optional but recommended for robust auth)
        await adminAuth.setCustomUserClaims(userId, { role: newRole });

        revalidatePath("/admin");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
