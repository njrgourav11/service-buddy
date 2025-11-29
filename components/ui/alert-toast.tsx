import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    CheckCircle2,
    AlertTriangle,
    Info,
    XOctagon,
    X,
} from "lucide-react";

// Define variants for the alert toast using cva
const alertToastVariants = cva(
    "relative w-full max-w-[320px] overflow-hidden rounded-2xl shadow-lg flex items-start p-3 gap-3 border backdrop-blur-md transition-all duration-300 select-none",
    {
        variants: {
            variant: {
                success: "bg-white/80 dark:bg-zinc-900/80 border-green-200 dark:border-green-900/50 text-zinc-800 dark:text-zinc-100",
                warning: "bg-white/80 dark:bg-zinc-900/80 border-amber-200 dark:border-amber-900/50 text-zinc-800 dark:text-zinc-100",
                info: "bg-white/80 dark:bg-zinc-900/80 border-blue-200 dark:border-blue-900/50 text-zinc-800 dark:text-zinc-100",
                error: "bg-white/80 dark:bg-zinc-900/80 border-red-200 dark:border-red-900/50 text-zinc-800 dark:text-zinc-100",
            },
            styleVariant: {
                default: "",
                filled: "border-transparent text-white", // Keep filled for solid color option if needed, but default will be glass
            },
        },
        compoundVariants: [
            {
                variant: "success",
                styleVariant: "filled",
                className: "bg-green-600 dark:bg-green-600 text-white",
            },
            {
                variant: "warning",
                styleVariant: "filled",
                className: "bg-amber-500 dark:bg-amber-600 text-white",
            },
            {
                variant: "info",
                styleVariant: "filled",
                className: "bg-blue-600 dark:bg-blue-600 text-white",
            },
            {
                variant: "error",
                styleVariant: "filled",
                className: "bg-red-600 dark:bg-red-600 text-white",
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

// Define icon color classes for the default (glass) variant
const iconColorClasses: Record<string, string> = {
    success: "text-green-500 dark:text-green-400",
    warning: "text-amber-500 dark:text-amber-400",
    info: "text-blue-500 dark:text-blue-400",
    error: "text-red-500 dark:text-red-400",
};

export interface AlertToastProps
    extends VariantProps<typeof alertToastVariants> {
    /** The title of the alert. */
    title: string;
    /** A more detailed description for the alert. */
    description?: string;
    /** A function to call when the alert is dismissed. */
    onClose: () => void;
    /** Optional className for additional styling. */
    className?: string;
}

const AlertToast = React.forwardRef<HTMLDivElement, AlertToastProps>(
    ({ className, variant = 'info', styleVariant = 'default', title, description, onClose }, ref) => {
        const Icon = iconMap[variant || 'info'];
        const iconColor = styleVariant === 'filled' ? "text-white" : iconColorClasses[variant || 'info'];

        return (
            <motion.div
                ref={ref}
                role="alert"
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(alertToastVariants({ variant, styleVariant }), className)}
            >
                {/* Icon */}
                <div className="flex-shrink-0 pt-0.5">
                    <Icon className={cn("h-5 w-5", iconColor)} aria-hidden="true" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">{title}</p>
                    {description && (
                        <p className="text-xs opacity-80 mt-1 leading-relaxed">{description}</p>
                    )}
                </div>

                {/* Close Button */}
                <div className="flex-shrink-0 -mr-1 -mt-1">
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className={cn(
                            "p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity focus:outline-none",
                            styleVariant === 'filled' ? "text-white hover:bg-white/20" : "hover:bg-black/5 dark:hover:bg-white/10"
                        )}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </motion.div>
        );
    }
);

AlertToast.displayName = "AlertToast";

export { AlertToast, alertToastVariants };
