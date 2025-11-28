"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Loader2, CheckCircle2, MapPin, User, Briefcase, FileText, Upload } from "lucide-react";
import { registerTechnician } from "@/actions/technician";

const STEPS = [
    { id: 1, title: "Basic Info", icon: User },
    { id: 2, title: "Location", icon: MapPin },
    { id: 3, title: "Professional", icon: Briefcase },
    { id: 4, title: "Documents", icon: FileText },
    { id: 5, title: "Review", icon: CheckCircle2 },
];

const ODISHA_CITIES = [
    "Berhampur",
    "Bhubaneswar",
    "Cuttack",
    "Rourkela",
    "Sambalpur",
    "Puri",
    "Balasore",
    "Bhadrak",
    "Baripada",
    "Jharsuguda"
];

const BERHAMPUR_AREAS = [
    "Aska Road",
    "Engineering School Road",
    "Courtpeta",
    "Ganjam",
    "Goilundi",
    "Gosaninuagam",
    "Hill Patna",
    "Kamapalli",
    "Lanjipalli",
    "Prem Nagar"
];

export default function TechnicianOnboarding() {
    const { user } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Step 1: Basic Info
        fullName: "",
        email: "",
        phone: "",
        password: "", // Only for new users

        // Step 2: Location
        address: "",
        city: "Berhampur",
        area: "",
        zip: "",
        state: "Odisha",

        // Step 3: Professional
        category: "",
        experience: "",
        bio: "",

        // Step 4: Documents (Mock)
        aadhaarFront: null,
        aadhaarBack: null,
        profilePhoto: null,
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.displayName || "",
                email: user.email || "",
                phone: user.phoneNumber || ""
            }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateStep = () => {
        switch (step) {
            case 1:
                return formData.fullName && formData.phone && formData.email && (user || formData.password);
            case 2:
                return formData.address && formData.city && formData.zip;
            case 3:
                return formData.category && formData.experience && formData.bio;
            case 4:
                return true; // Documents are optional for now or mock
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (!validateStep()) {
            alert("Please fill in all required fields.");
            return;
        }
        if (step < 5) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let userCredential;
            // Create user if not logged in
            if (!user) {
                userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                await updateProfile(userCredential.user, { displayName: formData.fullName });
            }

            const currentUser = user || userCredential?.user;
            if (!currentUser) throw new Error("User creation failed");

            const token = await currentUser.getIdToken();

            // Call Server Action
            const result = await registerTechnician(formData, token);

            if (!result.success) {
                throw new Error(result.error);
            }

            router.push("/technician/dashboard");
        } catch (error: any) {
            console.error("Error submitting application:", error);
            alert(error.message || "Failed to submit application. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center relative">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 -z-10" />
                        {STEPS.map((s) => {
                            const Icon = s.icon;
                            const isActive = s.id === step;
                            const isCompleted = s.id < step;

                            return (
                                <div key={s.id} className="flex flex-col items-center bg-gray-50 dark:bg-gray-950 px-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive || isCompleted
                                        ? "bg-blue-600 border-blue-600 text-white"
                                        : "bg-white dark:bg-gray-900 border-gray-300 text-gray-400"
                                        }`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className={`text-xs mt-2 font-medium ${isActive ? "text-blue-600" : "text-gray-500"
                                        }`}>{s.title}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <Card className="border-none shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            {STEPS[step - 1].title}
                        </CardTitle>
                        <CardDescription>
                            Step {step} of 5
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" disabled={!!user} />
                                </div>
                                {!user && (
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Create Password</Label>
                                        <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Location */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="address">Street Address</Label>
                                    <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Plot No, Street Name" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>City</Label>
                                        <Select value={formData.city} onValueChange={(val) => handleSelectChange("city", val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select City" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ODISHA_CITIES.map(city => (
                                                    <SelectItem key={city} value={city}>{city}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Area (if Berhampur)</Label>
                                        <Select value={formData.area} onValueChange={(val) => handleSelectChange("area", val)} disabled={formData.city !== "Berhampur"}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Area" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {BERHAMPUR_AREAS.map(area => (
                                                    <SelectItem key={area} value={area}>{area}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" name="state" value={formData.state} disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zip">Zip Code</Label>
                                        <Input id="zip" name="zip" value={formData.zip} onChange={handleChange} placeholder="760001" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Professional */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Service Category</Label>
                                    <Select value={formData.category} onValueChange={(val) => handleSelectChange("category", val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="plumber">Plumber</SelectItem>
                                            <SelectItem value="electrician">Electrician</SelectItem>
                                            <SelectItem value="carpenter">Carpenter</SelectItem>
                                            <SelectItem value="cleaning">Cleaning</SelectItem>
                                            <SelectItem value="ac-repair">AC Repair</SelectItem>
                                            <SelectItem value="painter">Painter</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="experience">Years of Experience</Label>
                                    <Input id="experience" name="experience" type="number" value={formData.experience} onChange={handleChange} placeholder="e.g. 5" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">About Yourself</Label>
                                    <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about your skills and experience..." className="h-32" />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Documents */}
                        {step === 4 && (
                            <div className="space-y-6">
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Upload Aadhaar Front</h3>
                                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                                </div>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Upload Aadhaar Back</h3>
                                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                                </div>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Upload Profile Photo</h3>
                                    <p className="text-sm text-gray-500">Professional headshot preferred</p>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Review */}
                        {step === 5 && (
                            <div className="space-y-4">
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Name:</span>
                                        <span className="font-medium">{formData.fullName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Email:</span>
                                        <span className="font-medium">{formData.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Phone:</span>
                                        <span className="font-medium">{formData.phone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Location:</span>
                                        <span className="font-medium">{formData.address}, {formData.city}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Profession:</span>
                                        <span className="font-medium capitalize">{formData.category}</span>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <Checkbox id="terms" />
                                    <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        I agree to the Terms & Conditions and Privacy Policy. I confirm that the details provided are accurate.
                                    </Label>
                                </div>
                            </div>
                        )}

                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                            Back
                        </Button>
                        {step < 5 ? (
                            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                                Next
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700">
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit Application"}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
