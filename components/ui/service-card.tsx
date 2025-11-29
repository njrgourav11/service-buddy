"use client";
import { animate, motion, useMotionTemplate, useMotionValue } from "framer-motion";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface ServiceCardProps {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color?: string;
    className?: string;
}

export default function ServiceCard({ title, description, icon: Icon, color, className }: ServiceCardProps) {
    return (
        <Card className={className} color={color}>
            <CardSkeletonContainer>
                <Skeleton icon={Icon} color={color} />
            </CardSkeletonContainer>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
                {description}
            </CardDescription>
        </Card>
    );
}

const Skeleton = ({ icon: Icon, color }: { icon: React.ComponentType<{ className?: string }>, color?: string }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className="h-full w-full absolute inset-0 bg-transparent flex items-center justify-center group/skeleton overflow-hidden"
            onMouseMove={onMouseMove}
        >
            {/* Hero Icon */}
            <div className="relative z-10 flex items-center justify-center transition-transform duration-500 group-hover/skeleton:scale-110">
                <div className={cn(
                    "relative h-24 w-24 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500",
                    "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800",
                    "group-hover/skeleton:shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] dark:group-hover/skeleton:shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]"
                )}>
                    {/* Icon Glow */}
                    <div className={cn(
                        "absolute inset-0 rounded-3xl opacity-0 group-hover/skeleton:opacity-20 transition-opacity duration-500 blur-xl",
                        color ? `bg-gradient-to-br ${color}` : "bg-blue-500"
                    )} />

                    <Icon className={cn(
                        "h-12 w-12 transition-colors duration-500",
                        color ? `text-${color.split(' ')[0].replace('from-', '')}` : "text-blue-500",
                        "dark:text-white"
                    )} />
                </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            {/* Spotlight Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover/skeleton:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.1),
              transparent 80%
            )
          `,
                }}
            />

            {/* Animated Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Sparkles color={color} />
            </div>
        </div>
    );
};

const Sparkles = ({ color }: { color?: string }) => {
    const [sparkles, setSparkles] = useState<Array<{ top: string; left: string; delay: number; duration: number }>>([]);

    useEffect(() => {
        const randomMove = () => Math.random() * 2 - 1;
        const random = () => Math.random();

        const newSparkles = [...Array(8)].map(() => ({
            top: `${random() * 100}%`,
            left: `${random() * 100}%`,
            delay: random() * 2,
            duration: random() * 3 + 2,
            moveX: randomMove(),
            moveY: randomMove(),
        }));
        setSparkles(newSparkles as any);
    }, []);

    // Extract base color for particles
    const textColor = color ? `text-${color.split(' ')[0].replace('from-', '')}` : "text-blue-500";

    return (
        <div className={cn("absolute inset-0", textColor)}>
            {sparkles.map((sparkle, i) => (
                <motion.span
                    key={`star-${i}`}
                    animate={{
                        top: `calc(${sparkle.top} + ${// @ts-ignore
                            sparkle.moveY}px)`,
                        left: `calc(${sparkle.left} + ${// @ts-ignore
                            sparkle.moveX}px)`,
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: sparkle.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: sparkle.delay,
                    }}
                    style={{
                        position: "absolute",
                        top: sparkle.top,
                        left: sparkle.left,
                        width: `3px`,
                        height: `3px`,
                        borderRadius: "50%",
                    }}
                    className={cn("inline-block bg-current opacity-50")}
                ></motion.span>
            ))}
        </div>
    );
};

export const Card = ({
    className,
    children,
    color,
}: {
    className?: string;
    children: React.ReactNode;
    color?: string;
}) => {
    return (
        <div
            className={cn(
                "max-w-sm w-full mx-auto p-6 rounded-3xl border transition-all duration-300 group",
                "bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm",
                "border-slate-200 dark:border-slate-800",
                "hover:border-slate-300 dark:hover:border-slate-700",
                "hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-slate-900/50",
                className
            )}
        >
            {children}
        </div>
    );
};

export const CardTitle = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <h3
            className={cn(
                "text-xl font-bold text-slate-900 dark:text-white py-2 mt-4 text-center group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 dark:group-hover:from-white dark:group-hover:to-slate-300 transition-all duration-300",
                className
            )}
        >
            {children}
        </h3>
    );
};

export const CardDescription = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <p
            className={cn(
                "text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm text-center leading-relaxed",
                className
            )}
        >
            {children}
        </p>
    );
};

export const CardSkeletonContainer = ({
    className,
    children,
    showGradient = true,
}: {
    className?: string;
    children: React.ReactNode;
    showGradient?: boolean;
}) => {
    return (
        <div
            className={cn(
                "h-[12rem] rounded-2xl z-40 relative overflow-hidden transition-all duration-500",
                "bg-slate-50 dark:bg-slate-800/50",
                "group-hover:bg-white dark:group-hover:bg-slate-800",
                className
            )}
        >
            {children}
        </div>
    );
};
