"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, User, Mail, Lock, Phone, AlertCircle, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OTPInput } from "@/components/ui/otp-input";

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"method" | "otp" | "details">("method");
  const router = useRouter();

  // Removed useEffect for RecaptchaVerifier to avoid "argument-error" when element is not in DOM

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName,
        lastName,
        email,
        phone,
        role: "user",
        createdAt: new Date().toISOString()
      });

      router.push("/profile");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number.");
      setIsLoading(false);
      return;
    }

    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    try {
      if (!window.recaptchaVerifier) {
        // @ts-ignore
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container-register", {
          size: "invisible",
        });
      }
      // @ts-ignore
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      setStep("otp");
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      setError(err.message || "Failed to send OTP. Please try again.");
      if (window.recaptchaVerifier) {
        // @ts-ignore
        window.recaptchaVerifier.clear();
        // @ts-ignore
        window.recaptchaVerifier = null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult || !otp) return;
    setIsLoading(true);
    setError("");

    try {
      await confirmationResult.confirm(otp);
      setStep("details");
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;

    try {
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`
        });

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          firstName,
          lastName,
          email,
          phone,
          role: "user",
          createdAt: new Date().toISOString()
        });

        router.push("/profile");
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to save details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 py-12">
      <Card className="w-full max-w-md border-none shadow-xl bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 w-full" />
        <CardHeader className="space-y-1 text-center pt-8">
          <div className="mx-auto bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl w-fit mb-4">
            <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Join Service Buddy today
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          {error && (
            <Alert variant="destructive" className="mb-6 rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <TabsTrigger value="email" disabled={step !== "method"} className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Email</TabsTrigger>
              <TabsTrigger value="phone" disabled={step !== "method"} className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Phone</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={handleEmailRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" name="firstName" placeholder="John" required className="h-11 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" name="lastName" placeholder="Doe" required className="h-11 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="name@example.com" required className="h-11 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" placeholder="+91 98765 43210" required className="h-11 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required className="h-11 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
                </div>
                <Button className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-blue-500/25 transition-all" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="phone">
              {step === "method" && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="98765 43210"
                        className="pl-10 h-11 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div id="recaptcha-container-register"></div>
                  <Button className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-blue-500/25 transition-all" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send OTP"}
                  </Button>
                </form>
              )}

              {step === "otp" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">We&apos;ll send you a One Time Password (OTP)</p>
                    <p className="font-bold text-lg">{phone}</p>
                  </div>

                  <OTPInput length={6} onComplete={setOtp} />

                  <Button
                    className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-blue-500/25 transition-all"
                    onClick={handleVerifyOtp}
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify OTP"}
                  </Button>
                </div>
              )}

              {step === "details" && (
                <form onSubmit={handleSaveDetails} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" name="firstName" placeholder="John" required className="h-11 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" name="lastName" placeholder="Doe" required className="h-11 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input id="email" name="email" type="email" placeholder="name@example.com" className="h-11 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
                  </div>
                  <Button className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-blue-500/25 transition-all" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Complete Registration"}
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-900 px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" disabled className="rounded-xl h-11 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              Google
            </Button>
            <Button variant="outline" type="button" disabled className="rounded-xl h-11 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              Facebook
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 justify-center pb-8 bg-gray-50/50 dark:bg-gray-800/50 pt-6">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Login
            </Link>
          </p>
          <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-4 w-full">
            <p className="text-sm text-gray-500 mb-2">Want to join as a Professional?</p>
            <Button variant="outline" className="w-full rounded-xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800" asChild>
              <Link href="/technician/onboarding">
                Register as Technician
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}