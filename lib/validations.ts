import { z } from "zod";

export const bookingSchema = z.object({
    serviceId: z.string().min(1, "Service ID is required"),
    serviceName: z.string().min(1, "Service Name is required"),
    package: z.string().optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
    time: z.string().min(1, "Time slot is required"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    userId: z.string().optional(), // Can be inferred from token
    userName: z.string().optional(),
    amount: z.number().min(0, "Amount is required"),
});

export const technicianSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(6, "Zip code must be 6 digits"),
    category: z.string().min(1, "Category is required"),
    experience: z.string().min(1, "Experience is required"),
    bio: z.string().optional(),
});

export const serviceSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    category: z.string().min(1, "Category is required"),
    price: z.number().min(0, "Price must be positive"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    image: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export const userProfileSchema = z.object({
    displayName: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 digits").optional().or(z.literal("")),
    address: z.string().optional(),
});

export const reviewSchema = z.object({
    bookingId: z.string().min(1, "Booking ID is required"),
    technicianId: z.string().min(1, "Technician ID is required"),
    rating: z.number().min(1).max(5),
    comment: z.string().min(5, "Comment must be at least 5 characters"),
});
