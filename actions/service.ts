"use server";

import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import { serviceSchema } from "@/lib/validations";


async function verifyAdmin(token: string) {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
}

export async function deleteService(id: string, token: string) {
    try {
        await verifyAdmin(token);
        await adminDb.collection("services").doc(id).delete();
        revalidatePath("/admin");
        revalidatePath("/services");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getServicesForAdmin(token: string) {
    try {
        await verifyAdmin(token);
        const snapshot = await adminDb.collection("services").get();
        const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { success: true, services };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
