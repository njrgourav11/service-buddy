"use server";

import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    link?: string;
    createdAt: string;
}

export async function createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = "info",
    link?: string
) {
    try {
        await adminDb.collection("notifications").add({
            userId,
            title,
            message,
            type,
            read: false,
            link,
            createdAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error: any) {
        console.error("Error creating notification:", error);
        return { success: false, error: error.message };
    }
}

export async function getNotifications(token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        const snapshot = await adminDb.collection("notifications")
            .where("userId", "==", uid)
            .orderBy("createdAt", "desc")
            .limit(20)
            .get();

        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
        return { success: true, notifications };
    } catch (error: any) {
        console.error("Error fetching notifications:", error);
        return { success: false, error: error.message };
    }
}

export async function markAsRead(notificationId: string, token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        const docRef = adminDb.collection("notifications").doc(notificationId);
        const doc = await docRef.get();

        if (!doc.exists) return { success: false, error: "Notification not found" };
        if (doc.data()?.userId !== uid) return { success: false, error: "Unauthorized" };

        await docRef.update({ read: true });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Helper to notify all admins
export async function notifyAdmins(title: string, message: string, type: NotificationType = "info", link?: string) {
    try {
        const adminSnapshot = await adminDb.collection("users").where("role", "==", "admin").get();
        const batch = adminDb.batch();

        adminSnapshot.docs.forEach(doc => {
            const ref = adminDb.collection("notifications").doc();
            batch.set(ref, {
                userId: doc.id,
                title,
                message,
                type,
                read: false,
                link,
                createdAt: new Date().toISOString()
            });
        });

        await batch.commit();
        return { success: true };
    } catch (error: any) {
        console.error("Error notifying admins:", error);
        return { success: false, error: error.message };
    }
}
