import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

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
    },
    {
        id: "plumbing-service",
        title: "Plumbing Services",
        category: "Plumbing",
        price: 299,
        rating: 4.7,
        reviews: 250,
        bookings: "3k+",
        image: "🔧",
        description: "Professional plumbing services for all your home needs.",
        features: ["Quick response", "Experienced plumbers", "Quality materials"],
        packages: {
            basic: {
                name: "Basic",
                price: 299,
                duration: "30-45 mins",
                features: ["Tap Repair", "Leak Fixing", "Basic Installation"]
            },
            standard: {
                name: "Standard",
                price: 599,
                duration: "1-2 hrs",
                features: ["Pipe Installation", "Drain Cleaning", "Water Tank Repair"]
            },
            premium: {
                name: "Premium",
                price: 999,
                duration: "2-3 hrs",
                features: ["Complete Bathroom Plumbing", "Water Heater Installation", "Drainage System"]
            }
        }
    },
    {
        id: "electrical-service",
        title: "Electrical Services",
        category: "Electrical",
        price: 249,
        rating: 4.6,
        reviews: 180,
        bookings: "2.5k+",
        image: "⚡",
        description: "Safe and reliable electrical services for your home.",
        features: ["Licensed electricians", "Safety guaranteed", "Quick service"],
        packages: {
            basic: {
                name: "Basic",
                price: 249,
                duration: "30 mins",
                features: ["Switch/Socket Repair", "Bulb Installation", "Minor Wiring"]
            },
            standard: {
                name: "Standard",
                price: 499,
                duration: "1-2 hrs",
                features: ["Fan Installation", "Light Fitting", "MCB Replacement"]
            },
            premium: {
                name: "Premium",
                price: 899,
                duration: "2-3 hrs",
                features: ["Complete Wiring", "DB Installation", "Safety Inspection"]
            }
        }
    },
    {
        id: "home-painting",
        title: "Home Painting",
        category: "Home Repair",
        price: 2999,
        rating: 4.9,
        reviews: 95,
        bookings: "1k+",
        image: "🎨",
        description: "Professional painting services to transform your home.",
        features: ["Premium paints", "Skilled painters", "Clean finish"],
        packages: {
            basic: {
                name: "Basic",
                price: 2999,
                duration: "1-2 days",
                features: ["Single Room", "1 Coat", "Basic Colors"]
            },
            standard: {
                name: "Standard",
                price: 5999,
                duration: "2-3 days",
                features: ["2 Rooms", "2 Coats", "Premium Colors"]
            },
            premium: {
                name: "Premium",
                price: 9999,
                duration: "3-5 days",
                features: ["Full House", "3 Coats", "Designer Finish"]
            }
        }
    },
    {
        id: "salon-at-home",
        title: "Salon at Home",
        category: "Beauty",
        price: 599,
        rating: 4.8,
        reviews: 420,
        bookings: "8k+",
        image: "💇",
        description: "Professional salon services in the comfort of your home.",
        features: ["Trained beauticians", "Quality products", "Hygiene guaranteed"],
        packages: {
            basic: {
                name: "Basic",
                price: 599,
                duration: "45 mins",
                features: ["Hair Cut", "Hair Wash", "Basic Styling"]
            },
            standard: {
                name: "Standard",
                price: 1299,
                duration: "1.5 hrs",
                features: ["Hair Cut & Style", "Facial", "Manicure"]
            },
            premium: {
                name: "Premium",
                price: 2499,
                duration: "2-3 hrs",
                features: ["Complete Makeover", "Hair Spa", "Facial", "Manicure & Pedicure"]
            }
        }
    },
    {
        id: "massage-therapy",
        title: "Massage & Therapy",
        category: "Wellness",
        price: 999,
        rating: 4.7,
        reviews: 150,
        bookings: "2k+",
        image: "💆",
        description: "Relaxing massage therapy at your doorstep.",
        features: ["Certified therapists", "Premium oils", "Relaxation guaranteed"],
        packages: {
            basic: {
                name: "Basic",
                price: 999,
                duration: "45 mins",
                features: ["Swedish Massage", "Relaxation"]
            },
            standard: {
                name: "Standard",
                price: 1499,
                duration: "1 hr",
                features: ["Deep Tissue", "Aromatherapy", "Stress Relief"]
            },
            premium: {
                name: "Premium",
                price: 2499,
                duration: "1.5 hrs",
                features: ["Full Body Massage", "Hot Stone", "Aromatherapy", "Head Massage"]
            }
        }
    },
    {
        id: "gardening-service",
        title: "Gardening Services",
        category: "Gardening",
        price: 499,
        rating: 4.5,
        reviews: 85,
        bookings: "800+",
        image: "🌱",
        description: "Professional gardening and lawn care services.",
        features: ["Expert gardeners", "Quality tools", "Plant care"],
        packages: {
            basic: {
                name: "Basic",
                price: 499,
                duration: "1 hr",
                features: ["Lawn Mowing", "Basic Trimming", "Watering"]
            },
            standard: {
                name: "Standard",
                price: 899,
                duration: "2 hrs",
                features: ["Lawn Care", "Plant Pruning", "Fertilizing", "Pest Control"]
            },
            premium: {
                name: "Premium",
                price: 1499,
                duration: "3 hrs",
                features: ["Complete Garden Makeover", "Landscaping", "Plant Installation", "Maintenance"]
            }
        }
    }
];

export const seedServices = async () => {
    try {
        const servicesRef = collection(db, "services");

        for (const service of services) {
            const docRef = doc(servicesRef, service.id);
            await setDoc(docRef, service);
            console.log(`Added service: ${service.title}`);
        }

        console.log("✅ All services seeded successfully!");
        return { success: true, count: services.length };
    } catch (error) {
        console.error("❌ Error seeding services:", error);
        return { success: false, error };
    }
};
