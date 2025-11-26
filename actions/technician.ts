"use server";

import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import { notifyAdmins } from "./notification";

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
