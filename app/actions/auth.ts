'use server';

import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function updateUserProfile(data: any, token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        // Update Firestore
        await adminDb.collection('users').doc(uid).set(data, { merge: true });

        // Update Auth Profile if applicable
        const authUpdates: any = {};
        if (data.displayName) authUpdates.displayName = data.displayName;
        if (data.photoURL) authUpdates.photoURL = data.photoURL;

        // Note: Phone number update in Auth is sensitive and requires strict formatting/uniqueness.
        // We are only updating it in Firestore for now to avoid errors.

        if (Object.keys(authUpdates).length > 0) {
            await adminAuth.updateUser(uid, authUpdates);
        }

        return { success: true };
    } catch (error: any) {
        console.error('Error updating profile:', error);
        return { success: false, error: error.message };
    }
}

export async function createReview(data: any, token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        const reviewData = {
            ...data,
            userId: uid,
            createdAt: new Date().toISOString(),
        };

        await adminDb.collection('reviews').add(reviewData);

        return { success: true };
    } catch (error: any) {
        console.error('Error creating review:', error);
        return { success: false, error: error.message };
    }
}
