"use server";

import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import { notifyAdmins, createNotification } from "./notification";
import { bookingSchema } from "@/lib/validations";

export async function createBooking(data: any, token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        // Validate Data
        const validationResult = bookingSchema.safeParse(data);
        if (!validationResult.success) {
            return { success: false, error: validationResult.error.issues[0].message };
        }
        const validData = validationResult.data;

        // Create Booking
        const bookingRef = await adminDb.collection("bookings").add({
            ...validData,
            userId: uid,
            status: "pending_payment",
            createdAt: new Date().toISOString()
        });

        // Notify User
        await createNotification(
            uid,
            "Booking Created",
            `Your booking for ${validData.serviceName} has been created. Please complete the payment.`,
            "info",
            `/payment?bookingId=${bookingRef.id}`
        );

        // Notify Admins
        await notifyAdmins(
            "New Booking",
            `New booking by ${validData.userName} for ${validData.serviceName}`,
            "info",
            `/admin/bookings/${bookingRef.id}`
        );

        return { success: true, bookingId: bookingRef.id };
    } catch (error: any) {
        console.error("Error creating booking:", error);
        return { success: false, error: error.message };
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
            const userRecord = await adminAuth.getUser(uid);
            // Simple ownership check for now
            return { success: false, error: "Unauthorized access to booking" };
        }

        return { success: true, booking };
    } catch (error: any) {
        console.error("Error fetching booking:", error);
        return { success: false, error: error.message };
    }
}

export async function getUserBookings(token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        const snapshot = await adminDb.collection("bookings")
            .where("userId", "==", uid)
            .orderBy("createdAt", "desc")
            .get();

        const bookings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, bookings };
    } catch (error: any) {
        console.error("Error fetching user bookings:", error);
        return { success: false, error: error.message };
    }
}

import { verifyAdmin } from "./admin";

export async function getAllBookings(token: string) {
    try {
        await verifyAdmin(token);

        const snapshot = await adminDb.collection("bookings")
            .orderBy("createdAt", "desc")
            .get();

        const bookings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, bookings };
    } catch (error: any) {
        console.error("Error fetching all bookings:", error);
        return { success: false, error: error.message };
    }
}
