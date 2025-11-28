"use server";

import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import { notifyAdmins } from "./notification";
import { bookingSchema } from "@/lib/validations";

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
