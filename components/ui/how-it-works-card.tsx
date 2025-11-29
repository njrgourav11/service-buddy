"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface HowItWorksCardProps {
    step: string;
    title: string;
    description: string;
    imageSrc: string;
    className?: string;
}

export default function HowItWorksCard({
    step,
    title,
    description,
    imageSrc,
    className,
}: HowItWorksCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-3xl h-[400px] w-full group border-none",
                className
            )}
        >
            {/* Background Image */}
            <Image
                alt={title}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                src={imageSrc}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />

            {/* Blurred Footer */}
            <div className="absolute bottom-2 left-2 right-2 z-10 overflow-hidden rounded-2xl border border-white/20 bg-white/10 py-3 px-4 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:bg-white/20 dark:bg-black/20 dark:border-white/10">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <p className="text-xs font-bold text-white/60 uppercase tracking-wider">
                            Step {step}
                        </p>
                        <h4 className="text-lg font-semibold text-white leading-tight">
                            {title}
                        </h4>
                        <p className="text-xs text-white/80 line-clamp-2 mt-1">
                            {description}
                        </p>
                    </div>

                    <Button
                        size="sm"
                        className="shrink-0 rounded-xl bg-black/20 text-white hover:bg-black/40 border border-white/10 backdrop-blur-sm h-10 w-10 p-0 flex items-center justify-center"
                    >
                        {step}
                    </Button>
                </div>
            </div>
        </div>
    );
}
