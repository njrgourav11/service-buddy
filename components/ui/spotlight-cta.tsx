"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SpotlightCTA() {
    const divRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current || isFocused) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative w-full overflow-hidden bg-white dark:bg-slate-950 py-32 sm:py-40 transition-colors duration-300"
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0,0,0,.05), transparent 40%)`,
                }}
            />
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 dark:block hidden"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.1), transparent 40%)`,
                }}
            />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    {/* Badge */}
                    <div className="mb-8 inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm text-slate-600 dark:text-slate-300">
                        <Star className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>Premium Home Services</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">
                        Ready to Transform <br />
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                            Your Living Space?
                        </span>
                    </h2>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Join thousands of satisfied homeowners who trust ServiceBuddy for their maintenance needs.
                        Quality service, verified professionals, and peace of mind guaranteed.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link href="/auth/register">
                            <Button
                                size="lg"
                                className="h-14 px-8 text-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 font-semibold rounded-full shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
                            >
                                Get Started Now
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>

                        <Link href="/services">
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-14 px-8 text-lg border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white rounded-full backdrop-blur-sm transition-all duration-300"
                            >
                                View All Services
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px]" />
            </div>
        </div>
    );
}
