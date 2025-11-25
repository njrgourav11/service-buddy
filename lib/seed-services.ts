import { adminDb } from "@/lib/firebase-admin";

const services = [
    {
        id: "home-cleaning",
        title: "Deep Home Cleaning",
        category: "Cleaning",
        price: 1499,
        rating: 4.8,
        reviews: 120,
        bookings: "5k+",
        image: "🧹",
        description: "Complete home cleaning service including floor scrubbing, cobweb removal, and bathroom deep cleaning.",
        features: ["Professional grade chemicals", "Trained & background verified partners", "Satisfaction guaranteed"],
        packages: {
            basic: {
                name: "Basic",
                price: 1499,
                duration: "2-3 hrs",
                features: ["Floor Cleaning", "Cobweb Removal", "Dry Dusting"]
            },
            standard: {
                name: "Standard",
                price: 2499,
                duration: "3-4 hrs",
                features: ["Floor Scrubbing", "Cobweb Removal", "Wet Wiping", "Bathroom Deep Cleaning", "Kitchen Cleaning"]
            },
            premium: {
                name: "Premium",
                price: 3499,
                duration: "4-5 hrs",
                features: ["Everything in Standard", "Sofa Vacuuming", "Balcony Cleaning", "Cabinet Interior Cleaning"]
            }
        }
    },
    {
        id: "ac-service",
        title: "AC Service & Repair",
        category: "Appliance",
        price: 599,
        rating: 4.8,
        reviews: 300,
        bookings: "2k+",
        image: "❄️",
        description: "Expert AC service and repair. We handle all brands and models.",
        features: ["30-day service warranty", "Genuine spare parts", "Background verified technicians"],
        packages: {
            basic: {
                name: "Service",
                price: 599,
                duration: "45-60 mins",
                features: ["Filter Cleaning", "Cooling Coil Cleaning", "Gas Check"]
            },
            standard: {
                name: "Repair",
                price: 299,
                duration: "Variable",
                features: ["Diagnosis", "Minor Repairs (Parts extra)"]
            },
            premium: {
                name: "Installation",
                price: 1499,
                duration: "1-2 hrs",
                features: ["Installation", "Gas Top-up", "Demo"]
            }
        }
    }
];

export const seedServices = async () => {
    const batch = adminDb.batch();

    services.forEach((service) => {
        const docRef = adminDb.collection("services").doc(service.id);
        batch.set(docRef, service);
    });

    await batch.commit();
    console.log("Services seeded successfully");
};
