"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface OTPInputProps {
    length?: number;
    onComplete: (otp: string) => void;
    className?: string;
}

export function OTPInput({ length = 6, onComplete, className }: OTPInputProps) {
    const [otp, setOtp] = React.useState<string[]>(new Array(length).fill(""));
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        // Allow only one digit
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Trigger onComplete if all fields are filled
        const combinedOtp = newOtp.join("");
        if (combinedOtp.length === length) {
            onComplete(combinedOtp);
        }

        // Move to next input if value is entered
        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            // Move to previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, length).split("");
        if (pastedData.every((char) => !isNaN(Number(char)))) {
            const newOtp = [...otp];
            pastedData.forEach((char, index) => {
                if (index < length) newOtp[index] = char;
            });
            setOtp(newOtp);
            const combinedOtp = newOtp.join("");
            if (combinedOtp.length === length) onComplete(combinedOtp);
            inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus();
        }
    };

    return (
        <div className={cn("flex gap-2 justify-center", className)}>
            {otp.map((digit, index) => (
                <Input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    ref={(ref) => { inputRefs.current[index] = ref }}
                    className="w-10 h-12 text-center text-lg font-bold"
                />
            ))}
        </div>
    );
}
