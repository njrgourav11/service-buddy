"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ManagerPage() {
    const router = useRouter();

    useEffect(() => {
        router.push("/manager/overview");
    }, [router]);

    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
}
