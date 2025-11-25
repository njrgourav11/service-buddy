"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { seedServices } from "@/lib/seed-services-client";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function SeedPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; count?: number; error?: any } | null>(null);

    const handleSeed = async () => {
        setLoading(true);
        setResult(null);

        const res = await seedServices();
        setResult(res);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-none shadow-xl rounded-3xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Database Seeding</CardTitle>
                    <CardDescription>
                        Click the button below to populate the services collection
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Button
                        onClick={handleSeed}
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700"
                        size="lg"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Seeding Database...
                            </>
                        ) : (
                            "Seed Services"
                        )}
                    </Button>

                    {result && (
                        <div className={`p-4 rounded-xl ${result.success ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"}`}>
                            <div className="flex items-center gap-2 mb-2">
                                {result.success ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                    <AlertCircle className="h-5 w-5" />
                                )}
                                <span className="font-semibold">
                                    {result.success ? "Success!" : "Error"}
                                </span>
                            </div>
                            <p className="text-sm">
                                {result.success
                                    ? `Successfully added ${result.count} services to the database.`
                                    : `Failed to seed services: ${result.error?.message || "Unknown error"}`}
                            </p>
                        </div>
                    )}

                    {result?.success && (
                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Services have been added! You can now visit the services page.
                            </p>
                            <Button variant="outline" asChild className="rounded-xl">
                                <a href="/services">View Services</a>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
