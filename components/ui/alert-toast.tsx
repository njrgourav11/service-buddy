import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils"; // Your utility for merging class names
import {
    CheckCircle2,
    AlertTriangle,
    Info,
    XOctagon,
    X,
} from "lucide-react";

// Define variants for the alert toast using cva
const alertToastVariants = cva(
    "relative w-[90vw] sm:w-full max-w-md overflow-hidden rounded-xl shadow-xl flex items-start p-4 space-x-4 border backdrop-blur-sm transition-all duration-300",
    {
        variants: {
            variant: {
                success: "bg-green-50/90 dark:bg-green-950/30 border-green-200 dark:border-green-800/50",
                warning: "bg-amber-50/90 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50",
                info: "bg-blue-50/90 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50",
                error: "bg-red-50/90 dark:bg-red-950/30 border-red-200 dark:border-red-800/50",
            },
            styleVariant: {
                default: "",
                filled: "border-transparent text-white",
            },
        },
        compoundVariants: [
            {
                variant: "success",
                styleVariant: "filled",
                className: "bg-green-600 dark:bg-green-600",
            },
            {
                variant: "warning",
                styleVariant: "filled",
                className: "bg-amber-500 dark:bg-amber-600",
            },
            {
                variant: "info",
                styleVariant: "filled",
                className: "bg-blue-600 dark:bg-blue-600",
            },
            {
                variant: "error",
                styleVariant: "filled",
                className: "bg-red-600 dark:bg-red-600",
            },
        ],
        defaultVariants: {
            variant: "info",
            styleVariant: "default",
        },
    }
);

// Define icon map for different variants
const iconMap = {
    success: CheckCircle2,
    warning: AlertTriangle,
    info: Info,
    error: XOctagon,
};

// Define icon color classes
const iconColorClasses: Record<string, Record<string, string>> = {
    default: {
        success: "text-green-600 dark:text-green-400",
        warning: "text-amber-600 dark:text-amber-400",
        info: "text-blue-600 dark:text-blue-400",
        error: "text-red-600 dark:text-red-400",
    },
    filled: {
        success: "text-white",
        warning: "text-white",
        info: "text-white",
        error: "text-white",
    },
};


export interface AlertToastProps
    extends VariantProps<typeof alertToastVariants> {
    /** The title of the alert. */
    title: string;
    /** A more detailed description for the alert. */
    description: string;
    /** A function to call when the alert is dismissed. */
    onClose: () => void;
    /** Optional className for additional styling. */
    className?: string;
}

const AlertToast = React.forwardRef<HTMLDivElement, AlertToastProps>(
    ({ className, variant = 'info', styleVariant = 'default', title, description, onClose }, ref) => {
        const Icon = iconMap[variant || 'info'];

        return (
            <motion.div
                ref={ref}
                role="alert"
                layout
                initial={{ opacity: 0, y: 50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.5 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                }}
                className={cn(alertToastVariants({ variant, styleVariant }), className)}
            >
                {/* Icon */}
                <div className="flex-shrink-0">
                    <Icon className={cn("h-6 w-6", iconColorClasses[styleVariant || 'default'][variant || 'info'])} aria-hidden="true" />
                </div>

                {/* Content */}
                <div className="flex-1">
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-sm opacity-90">{description}</p>
                </div>

                {/* Close Button */}
                <div className="flex-shrink-0">
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className={cn(
                            "p-1 rounded-full opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2",
                            styleVariant === 'default' ? "text-foreground/70 hover:bg-muted" : "hover:bg-black/20"
                        )}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </motion.div>
        );
    }
);

AlertToast.displayName = "AlertToast";

export { AlertToast, alertToastVariants };
