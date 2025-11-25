import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";

export interface Service {
    id: string;
    title: string;
    category: string;
    price: number;
    rating: number;
    reviews: number;
    bookings?: string;
    image: string;
    description: string;
    features: string[];
    packages: {
        [key: string]: {
            name: string;
            price: number;
            duration: string;
            features: string[];
        };
    };
}

export const getServices = async (): Promise<Service[]> => {
    const querySnapshot = await getDocs(collection(db, "services"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Service));
};

export const getServiceById = async (id: string): Promise<Service | null> => {
    const docRef = doc(db, "services", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Service;
    } else {
        return null;
    }
};
