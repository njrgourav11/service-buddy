"use server";

import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import { userProfileSchema } from "@/lib/validations";

export async function getUserProfile(token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        const userDoc = await adminDb.collection("users").doc(uid).get();
        if (!userDoc.exists) {
            return { success: false, error: "User not found" };
        }

        return { success: true, user: userDoc.data() };
    } catch (error: any) {
        console.error("Error fetching user profile:", error);
        return { success: false, error: error.message };
    }
}

export async function updateUserProfile(data: any, token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        // Validate Data
        const validationResult = userProfileSchema.safeParse(data);
        if (!validationResult.success) {
            return { success: false, error: validationResult.error.issues[0].message };
        }
        const validData = validationResult.data;

        // Update Firestore
        const nameParts = validData.displayName.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");

        await adminDb.collection("users").doc(uid).update({
            ...validData,
            firstName,
            lastName,
            updatedAt: new Date().toISOString()
        });

        // Update Auth Profile (Display Name)
        if (validData.displayName) {
            await adminAuth.updateUser(uid, {
                displayName: validData.displayName
            });
        }

        revalidatePath("/profile");
        return { success: true };
    } catch (error: any) {
        console.error("Error updating user profile:", error);
        return { success: false, error: error.message };
    }
}
