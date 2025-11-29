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
                <div className="mb-12">
                    <div className="flex justify-between items-center relative px-4">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 -z-10 rounded-full" />
                        {STEPS.map((s) => {
                            const Icon = s.icon;
                            const isActive = s.id === step;
                            const isCompleted = s.id < step;

                            return (
                                <div key={s.id} className="flex flex-col items-center bg-gray-50 dark:bg-gray-950 px-2 z-10">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-sm ${isActive || isCompleted
                                        ? "bg-blue-600 border-blue-100 dark:border-blue-900 text-white shadow-blue-200 dark:shadow-blue-900/20"
                                        : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400"
                                        }`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className={`text-xs mt-3 font-semibold tracking-wide uppercase ${isActive ? "text-blue-600" : "text-gray-400"
                                        }`}>{s.title}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <Card className="border-none shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-800">
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
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</Label>
                                        <Input
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="h-12 rounded-xl border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 bg-gray-50/50 dark:bg-gray-900/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+91 98765 43210"
                                            className="h-12 rounded-xl border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 bg-gray-50/50 dark:bg-gray-900/50"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        disabled={!!user}
                                        className="h-12 rounded-xl border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 bg-gray-50/50 dark:bg-gray-900/50 disabled:opacity-60"
                                    />
                                </div>
                                {!user && (
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Create Password</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="h-12 rounded-xl border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 bg-gray-50/50 dark:bg-gray-900/50"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Location */}
                        {step === 2 && (
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="address" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Street Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Plot No, Street Name"
                                        className="h-12 rounded-xl border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 bg-gray-50/50 dark:bg-gray-900/50"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">City</Label>
                                        <Select value={formData.city} onValueChange={(val) => handleSelectChange("city", val)}>
                                            <SelectTrigger className="h-12 rounded-xl border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
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
                                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Area (if Berhampur)</Label>
                                        <Select value={formData.area} onValueChange={(val) => handleSelectChange("area", val)} disabled={formData.city !== "Berhampur"}>
                                            <SelectTrigger className="h-12 rounded-xl border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="state" className="text-sm font-semibold text-gray-700 dark:text-gray-300">State</Label>
                                        <Input
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            disabled
                                            className="h-12 rounded-xl border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 opacity-70"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zip" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Zip Code</Label>
                                        <Input
                                            id="zip"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleChange}
                                            placeholder="760001"
                                            className="h-12 rounded-xl border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 bg-gray-50/50 dark:bg-gray-900/50"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Professional */}
                        {step === 3 && (
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Service Category</Label>
                                    <Select value={formData.category} onValueChange={(val) => handleSelectChange("category", val)}>
                                        <SelectTrigger className="h-12 rounded-xl border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
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
                                    <Label htmlFor="experience" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Years of Experience</Label>
                                    <Input
                                        id="experience"
                                        name="experience"
                                        type="number"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        placeholder="e.g. 5"
                                        className="h-12 rounded-xl border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 bg-gray-50/50 dark:bg-gray-900/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio" className="text-sm font-semibold text-gray-700 dark:text-gray-300">About Yourself</Label>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Tell us about your skills and experience..."
                                        className="min-h-[140px] rounded-xl border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 bg-gray-50/50 dark:bg-gray-900/50 resize-none p-4"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Documents */}
                        {step === 4 && (
                            <div className="space-y-6">
                                <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-400 dark:hover:border-blue-700 transition-all duration-300 cursor-pointer group">
                                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-500" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">Upload Aadhaar Front</h3>
                                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                                </div>
                                <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-400 dark:hover:border-blue-700 transition-all duration-300 cursor-pointer group">
                                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-500" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">Upload Aadhaar Back</h3>
                                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                                </div>
                                <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-400 dark:hover:border-blue-700 transition-all duration-300 cursor-pointer group">
                                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-500" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">Upload Profile Photo</h3>
                                    <p className="text-sm text-gray-500">Professional headshot preferred</p>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Review */}
                        {step === 5 && (
                            <div className="space-y-6">
                                <div className="bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-2xl space-y-4 border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Review Application</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Personal Details</span>
                                                <div className="font-medium text-gray-900 dark:text-gray-200">{formData.fullName}</div>
                                                <div className="text-sm text-gray-500">{formData.email}</div>
                                                <div className="text-sm text-gray-500">{formData.phone}</div>
                                            </div>
                                            <div>
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Address</span>
                                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                                    {formData.address}<br />
                                                    {formData.area && <>{formData.area}, <br /></>}
                                                    {formData.city}, {formData.state} - {formData.zip}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Professional Profile</span>
                                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium capitalize mb-2">
                                                    {formData.category}
                                                </div>
                                                <div className="text-sm text-gray-500">{formData.experience} Years Experience</div>
                                            </div>
                                            <div>
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Bio</span>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{formData.bio}"</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                                    <Checkbox id="terms" className="mt-1" />
                                    <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed cursor-pointer">
                                        I agree to the <span className="text-blue-600 font-medium">Terms & Conditions</span> and <span className="text-blue-600 font-medium">Privacy Policy</span>. I confirm that all the details provided above are accurate and I am authorized to work in the specified location.
                                    </Label>
                                </div>
                            </div>
                        )}

                    </CardContent>
                    <CardFooter className="flex justify-between p-8 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={step === 1}
                            className="h-12 px-6 rounded-xl border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800"
                        >
                            Back
                        </Button>
                        {step < 5 ? (
                            <Button
                                onClick={handleNext}
                                className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-blue-500/25 transition-all"
                            >
                                Next Step
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="h-12 px-8 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-green-500/25 transition-all"
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit Application"}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
