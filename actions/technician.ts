"use server";

import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import { notifyAdmins } from "./notification";
import { technicianSchema } from "@/lib/validations";

export async function registerTechnician(data: any, token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        // 1. Validate Data
        const validationResult = technicianSchema.safeParse(data);
        if (!validationResult.success) {
            return { success: false, error: validationResult.error.issues[0].message };
        }
        const validData = validationResult.data;

        // 2. Update User Role
        await adminDb.collection("users").doc(uid).set({
            email: validData.email,
            displayName: validData.fullName,
            role: "technician",
            phone: validData.phone,
            createdAt: new Date().toISOString() // Or keep original if exists, but set merge: true
        }, { merge: true });

        // 3. Create Technician Profile
        await adminDb.collection("technicians").doc(uid).set({
            userId: uid,
            ...validData,
            status: "pending",
            rating: 0,
            completedJobs: 0,
            joinedAt: new Date().toISOString()
        });

        // 4. Notify Admins
        await notifyAdmins(
            "New Technician Application",
            `${validData.fullName} has applied to be a ${validData.category}`,
            "info",
            "/admin"
        );

        revalidatePath("/technician/dashboard");
        return { success: true };
    } catch (error: any) {
        console.error("Error registering technician:", error);
        return { success: false, error: error.message };
    }
}

export async function acceptJob(jobId: string, token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        // 1. Get Technician Profile
        const techQuery = await adminDb.collection("technicians").where("userId", "==", uid).get();
        if (techQuery.empty) {
            return { success: false, error: "Technician profile not found" };
        }
        const techData = techQuery.docs[0].data();

        if (techData.status !== "approved") {
            return { success: false, error: "Technician not approved" };
        }

        // 2. Transaction to ensure job is available
        const result = await adminDb.runTransaction(async (t) => {
            const jobRef = adminDb.collection("bookings").doc(jobId);
            const jobDoc = await t.get(jobRef);

            if (!jobDoc.exists) {
                throw "Job not found";
            }

            const jobData = jobDoc.data();
            if (jobData?.status !== "confirmed" && jobData?.status !== "pending_verification") {
                // Assuming 'confirmed' is the state before assignment
                // If already assigned (accepted), fail
                if (jobData?.technicianId) {
                    throw "Job already assigned";
                }
            }

            t.update(jobRef, {
                status: "assigned", // or "accepted"
                technicianId: uid,
                technicianName: techData.fullName,
                technicianPhone: techData.phone || "",
                updatedAt: new Date().toISOString()
            });

            return "Job accepted successfully";
        });

        revalidatePath("/technician/dashboard");
        return { success: true, message: result };

    } catch (error: any) {
        console.error("Error accepting job:", error);
        return { success: false, error: error.message || error };
    }
}

export async function getTechnicianStatus(token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const q = await adminDb.collection("technicians").where("userId", "==", decodedToken.uid).get();

        if (q.empty) return { success: true, status: null };
        return { success: true, status: q.docs[0].data().status };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getAvailableJobs(token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        // Verify technician status first
        const techQuery = await adminDb.collection("technicians").where("userId", "==", decodedToken.uid).get();
        if (techQuery.empty || techQuery.docs[0].data().status !== "approved") {
            return { success: false, error: "Unauthorized" };
        }

        const jobsSnap = await adminDb.collection("bookings")
            .where("status", "==", "confirmed")
            // .where("paymentStatus", "==", "paid") // Optional: only show paid jobs
            .get();

        const jobs = jobsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { success: true, jobs };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getMyJobs(token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const jobsSnap = await adminDb.collection("bookings")
            .where("technicianId", "==", decodedToken.uid)
            .get();

        const jobs = jobsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { success: true, jobs };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
