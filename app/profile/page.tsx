"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, getDocs, collection, query, where, addDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateUserProfile, createReview } from '@/app/actions/auth';
import { AccountSettings } from '@/components/ui/account-settings';
import { Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Review State
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Fetch User Profile from Firestore to get persisted data (like phone)
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data());
          }

          // Fetch Bookings
          const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const bookingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
          // Sort by date desc
          bookingsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setBookings(bookingsData);

          // Fetch Addresses
          const addressQuery = query(collection(db, `users/${user.uid}/addresses`));
          const addressSnapshot = await getDocs(addressQuery);
          const addressesData = addressSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
          setAddresses(addressesData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoadingBookings(false);
          setLoadingAddresses(false);
        }
      } else {
        setLoadingBookings(false);
        setLoadingAddresses(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [user, authLoading]);

  const handleUpdateProfile = async (data: any) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const result = await updateUserProfile(data, token);

      if (result.success) {
        showToast({
          title: "Success",
          description: "Profile updated successfully!",
          variant: "success",
        });
        // Update local state to reflect changes immediately
        setUserProfile((prev: any) => ({ ...prev, ...data }));
      } else {
        console.error(result.error);
        showToast({
          title: "Error",
          description: "Failed to update profile: " + result.error,
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "error",
      });
    }
  };

  const handleAddAddress = async (data: any) => {
    if (!user) return;
    try {
      const newAddress = { ...data, createdAt: new Date().toISOString() };
      const docRef = await addDoc(collection(db, `users/${user.uid}/addresses`), newAddress);
      setAddresses([...addresses, { id: docRef.id, ...newAddress }]);
      showToast({
        title: "Success",
        description: "Address added successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error("Error adding address:", error);
      showToast({
        title: "Error",
        description: "Failed to add address.",
        variant: "error",
      });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/addresses`, id));
      setAddresses(addresses.filter(addr => addr.id !== id));
      showToast({
        title: "Success",
        description: "Address deleted successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting address:", error);
      showToast({
        title: "Error",
        description: "Failed to delete address.",
        variant: "error",
      });
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !selectedBookingId) return;
    try {
      const token = await user.getIdToken();
      const result = await createReview({ ...reviewForm, bookingId: selectedBookingId }, token);

      if (result.success) {
        setIsReviewOpen(false);
        setReviewForm({ rating: 5, comment: "" });
        setSelectedBookingId(null);
        showToast({
          title: "Success",
          description: "Review submitted successfully!",
          variant: "success",
        });
      } else {
        showToast({
          title: "Error",
          description: "Failed to submit review: " + result.error,
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      showToast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "error",
      });
    }
  };

  const handleUploadAvatar = async (file: File) => {
    if (!user) return { success: false, error: "Not authenticated" };
    try {
      const storageRef = ref(storage, `avatars/${user.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update Firestore
      await updateUserProfile({ photoURL: downloadURL }, await user.getIdToken());

      // Update local state
      setUserProfile((prev: any) => ({ ...prev, photoURL: downloadURL }));

      return { success: true, url: downloadURL };
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      return { success: false, error: error.message };
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
        <Button asChild>
          <a href="/auth/login">Login</a>
        </Button>
      </div>
    );
  }

  // Merge Auth user and Firestore profile
  // Firestore profile takes precedence for fields like phone, displayName if they exist there
  const mergedUser = {
    ...user,
    ...userProfile,
    // Ensure we don't overwrite critical auth fields if they are missing in firestore
    uid: user.uid,
    email: user.email
  };

  return (
    <>
      <AccountSettings
        user={mergedUser}
        bookings={bookings}
        addresses={addresses}
        loadingBookings={loadingBookings}
        loadingAddresses={loadingAddresses}
        onUpdateProfile={handleUpdateProfile}
        onUploadAvatar={handleUploadAvatar}
        onAddAddress={handleAddAddress}
        onDeleteAddress={handleDeleteAddress}
        onReview={(id) => {
          setSelectedBookingId(id);
          setIsReviewOpen(true);
        }}
      />

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Service</DialogTitle>
            <DialogDescription>How was your experience?</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  className={`p-2 rounded-full transition-colors ${reviewForm.rating >= star ? "text-yellow-400" : "text-gray-300"
                    }`}
                >
                  <Star className="h-8 w-8 fill-current" />
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                placeholder="Tell us about your experience..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitReview}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}