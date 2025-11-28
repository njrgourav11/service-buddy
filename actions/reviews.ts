"use server";

import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import { reviewSchema } from "@/lib/validations";

export async function createReview(data: any, token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        // Validate Data
        const validationResult = reviewSchema.safeParse(data);
        if (!validationResult.success) {
            return { success: false, error: validationResult.error.issues[0].message };
        }
        const validData = validationResult.data;

        // Check if booking exists and belongs to user
        const bookingDoc = await adminDb.collection("bookings").doc(validData.bookingId).get();
        if (!bookingDoc.exists) {
            return { success: false, error: "Booking not found" };
        }
        const bookingData = bookingDoc.data();
        if (bookingData?.userId !== uid) {
            return { success: false, error: "Unauthorized" };
        }

        // Create Review
        await adminDb.collection("reviews").add({
            ...validData,
            userId: uid,
            createdAt: new Date().toISOString()
        });

        // Update Technician Rating
        const technicianId = bookingData.technicianId;
        if (technicianId) {
            const technicianRef = adminDb.collection("technicians").doc(technicianId);
            const technicianDoc = await technicianRef.get();

            if (technicianDoc.exists) {
                const techData = technicianDoc.data();
                const currentRating = techData?.rating || 0;
                const totalReviews = techData?.totalReviews || 0;

                const newTotalReviews = totalReviews + 1;
                const newRating = ((currentRating * totalReviews) + validData.rating) / newTotalReviews;

                await technicianRef.update({
                    rating: newRating,
                    totalReviews: newTotalReviews
                });
            }
        }

        revalidatePath("/profile");
        return { success: true };
    } catch (error: any) {
        console.error("Error creating review:", error);
        return { success: false, error: error.message };
    }
}
