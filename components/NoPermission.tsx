import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function NoPermission() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gray-50 dark:bg-gray-950">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Access Denied</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                You do not have permission to view this page. Please contact your administrator if you believe this is an error.
            </p>
            <Button asChild>
                <Link href="/">Go Home</Link>
            </Button>
        </div>
    );
}
