"use server";

import { adminDb, adminAuth } from "@/lib/firebase-admin";
import Razorpay from "razorpay";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createPaymentOrder(bookingId: string, token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);

        const bookingSnap = await adminDb.collection("bookings").doc(bookingId).get();
        if (!bookingSnap.exists) {
            return { success: false, error: "Booking not found" };
        }

        const booking = bookingSnap.data();
        if (booking?.userId !== decodedToken.uid) {
            return { success: false, error: "Unauthorized" };
        }

        const options = {
            amount: Math.round(booking?.amount * 100), // amount in paisa
            currency: "INR",
            receipt: `receipt_${bookingId}`,
            notes: {
                bookingId: bookingId,
                userId: decodedToken.uid
            }
        };

        const order = await razorpay.orders.create(options);
        return { success: true, order };

    } catch (error: any) {
        console.error("Error creating payment order:", error);
        return { success: false, error: error.message };
    }
}

import { generateInvoiceHTML } from "@/lib/invoice";

export async function generateInvoice(bookingId: string) {
    try {
        const bookingSnap = await adminDb.collection("bookings").doc(bookingId).get();
        if (!bookingSnap.exists) {
            return { success: false, error: "Booking not found" };
        }
        const booking = { id: bookingSnap.id, ...bookingSnap.data() } as any;

        const invoiceHtml = generateInvoiceHTML(booking);

        const invoiceRef = await adminDb.collection("invoices").add({
            bookingId,
            userId: booking.userId,
            html: invoiceHtml,
            createdAt: new Date().toISOString()
        });

        await adminDb.collection("bookings").doc(bookingId).update({
            invoiceId: invoiceRef.id,
            invoiceGeneratedAt: new Date().toISOString()
        });

        return { success: true, invoiceId: invoiceRef.id };
    } catch (error: any) {
        console.error("Error generating invoice:", error);
        return { success: false, error: error.message };
    }
}

export async function getInvoice(invoiceId: string) {
    try {
        const docSnap = await adminDb.collection("invoices").doc(invoiceId).get();
        if (!docSnap.exists) return { success: false, error: "Invoice not found" };
        return { success: true, invoice: docSnap.data() };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function verifyPayment(
    bookingId: string,
    paymentData: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string },
    token: string
) {
    try {
        await adminAuth.verifyIdToken(token);

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return { success: false, error: "Invalid payment signature" };
        }

        // Update Booking
        await adminDb.collection("bookings").doc(bookingId).update({
            status: "confirmed",
            paymentStatus: "paid",
            paymentMethod: "online",
            paymentDetails: paymentData,
            updatedAt: new Date().toISOString()
        });

        // Trigger Invoice Generation (Async)
        await generateInvoice(bookingId);

        revalidatePath(`/payment?bookingId=${bookingId}`);

        return { success: true };

    } catch (error: any) {
        console.error("Error verifying payment:", error);
        return { success: false, error: error.message };
    }
}

export async function updatePaymentStatusCash(bookingId: string, token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);

        // Verify ownership
        const bookingRef = adminDb.collection("bookings").doc(bookingId);
        const bookingSnap = await bookingRef.get();

        if (!bookingSnap.exists || bookingSnap.data()?.userId !== decodedToken.uid) {
            return { success: false, error: "Unauthorized" };
        }

        await bookingRef.update({
            status: "confirmed",
            paymentStatus: "pending_verification", // Cash needs verification usually, or just confirmed if trusting
            paymentMethod: "cash",
            updatedAt: new Date().toISOString()
        });

        // Generate invoice for cash payments too (provisional)
        await generateInvoice(bookingId);

        revalidatePath(`/payment?bookingId=${bookingId}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
