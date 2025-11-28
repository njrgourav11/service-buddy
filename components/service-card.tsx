"use client";

import { useState } from "react";
import { HeartIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardFooter,
    CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ServiceCardProps {
    id: string;
    title: string;
    description: string;
    price: string;
    image: string;
    category?: string;
    rating?: string;
    onAddToCart?: () => void;
}

export function ServiceCard({
    id,
    title,
    description,
    price,
    image,
    category,
    rating,
    onAddToCart,
}: ServiceCardProps) {
    const [liked, setLiked] = useState<boolean>(false);

    return (
        <div className="relative max-w-md rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 pt-0 shadow-lg overflow-hidden">
            <div className="flex h-60 items-center justify-center bg-white/10 backdrop-blur-sm">
                <Image
                    src={image}
                    alt={title}
                    width={300}
                    height={240}
                    className="object-cover w-full h-full"
                />
            </div>
            <Button
                size="icon"
                onClick={() => setLiked(!liked)}
                className="bg-primary/10 hover:bg-primary/20 absolute top-4 right-4 rounded-full backdrop-blur-sm"
            >
                <HeartIcon
                    className={cn(
                        "size-4",
                        liked ? "fill-red-500 stroke-red-500" : "stroke-white"
                    )}
                />
                <span className="sr-only">Like</span>
            </Button>
            <Card className="border-none rounded-t-none">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                        {category && <Badge variant="outline">{category}</Badge>}
                        {rating && <Badge variant="outline">⭐ {rating}</Badge>}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
                <CardFooter className="justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium uppercase text-muted-foreground">
                            Starting at
                        </span>
                        <span className="text-2xl font-bold text-primary">{price}</span>
                    </div>
                    <Button size="lg" onClick={onAddToCart}>
                        Book Now
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
