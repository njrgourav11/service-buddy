"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AlertToast, AlertToastProps } from "@/components/ui/alert-toast";
import { AnimatePresence } from "framer-motion";

type ToastType = Omit<AlertToastProps, "onClose"> & { id: string };

interface ToastContextType {
    showToast: (props: Omit<ToastType, "id">) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastType[]>([]);

    const showToast = useCallback((props: Omit<ToastType, "id">) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { ...props, id };
        setToasts((prev) => [...prev, newToast]);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-[320px] pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <div key={toast.id} className="pointer-events-auto">
                            <AlertToast
                                {...toast}
                                onClose={() => removeToast(toast.id)}
                            />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
