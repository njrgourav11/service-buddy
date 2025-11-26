"use server";

import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import { notifyAdmins } from "./notification";

export async function createBooking(data: any, token: string) {
    try {
        // 1. Verify User
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        if (uid !== data.userId) {
            return { success: false, error: "Unauthorized: User ID mismatch" };
        }

        // 2. Validate Data (Basic validation)
        if (!data.serviceId || !data.date || !data.time || !data.address) {
            return { success: false, error: "Missing required fields" };
        }

        // 3. Create Booking in Firestore
        const bookingData = {
            ...data,
            userId: uid,
            status: "pending_payment",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const docRef = await adminDb.collection("bookings").add(bookingData);

        // Notify Admins
        await notifyAdmins(
            "New Booking Request",
            `New booking for ${data.serviceName || "Service"} by user ${uid}`,
            "info",
            "/admin"
        );

        // 4. Revalidate cache if needed (though this is a new booking)
        revalidatePath("/booking");

        return { success: true, bookingId: docRef.id };
    } catch (error: any) {
        console.error("Error creating booking:", error);
        return { success: false, error: error.message || "Failed to create booking" };
    }
}

export async function getBooking(bookingId: string, token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        const docSnap = await adminDb.collection("bookings").doc(bookingId).get();

        if (!docSnap.exists) {
            return { success: false, error: "Booking not found" };
        }

        const booking = { id: docSnap.id, ...docSnap.data() } as any;

        // Allow user who created it or admin
        if (booking.userId !== uid && decodedToken.role !== "admin") {
            // Check if user is admin (custom claim or simple check if we had it)
            // For now, let's assume strict ownership unless admin
            // We can check admin role from token if set
            const userRecord = await adminAuth.getUser(uid);
            // This is expensive, maybe just rely on custom claims if set.
            // For now, simple ownership check.
            return { success: false, error: "Unauthorized access to booking" };
        }

        return { success: true, booking };
    } catch (error: any) {
        console.error("Error fetching booking:", error);
        return { success: false, error: error.message };
    }
}
