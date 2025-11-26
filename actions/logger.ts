"use server";

import { adminDb } from "@/lib/firebase-admin";

export type LogAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "APPROVE" | "REJECT" | "ASSIGN";
export type LogModule = "BOOKING" | "PAYMENT" | "TECHNICIAN" | "USER" | "SERVICE" | "SYSTEM";

interface LogEntry {
    action: LogAction;
    module: LogModule;
    description: string;
    userId?: string;
    userName?: string;
    metadata?: any;
    timestamp: string;
}

export async function logSystemAction(
    action: LogAction,
    module: LogModule,
    description: string,
    user?: { uid: string; name?: string },
    metadata?: any
) {
    try {
        const logEntry: LogEntry = {
            action,
            module,
            description,
            userId: user?.uid || "system",
            userName: user?.name || "System",
            metadata: metadata || {},
            timestamp: new Date().toISOString()
        };

        await adminDb.collection("system_logs").add(logEntry);
    } catch (error) {
        console.error("Failed to write system log:", error);
        // Don't throw, logging shouldn't break the main flow
    }
}
