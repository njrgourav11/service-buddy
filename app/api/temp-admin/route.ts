import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function GET(request: Request) {
    try {
        const email = "njrgourav@gmail.com";
        const user = await adminAuth.getUserByEmail(email);

        await adminDb.collection("users").doc(user.uid).set({
            role: "admin"
        }, { merge: true });

        await adminAuth.setCustomUserClaims(user.uid, { role: "admin" });

        return NextResponse.json({ success: true, message: `User ${email} is now an admin.` });
    } catch (error: any) {
        console.error("Error setting admin role:", error);
        return NextResponse.json(
            { success: false, error: error.message, stack: error.stack },
            { status: 200 }
        );
    }
}
