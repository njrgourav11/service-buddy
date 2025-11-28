import {
    Sparkles,
    Snowflake,
    Droplets,
    Zap,
    Wrench,
    Scissors,
    Leaf,
    Package
} from "lucide-react";

interface ServiceIconProps {
    serviceId: string;
    className?: string;
    fallbackImage?: string;
}

const serviceIcons: { [key: string]: any } = {
    "home-cleaning": Sparkles,
    "ac-service": Snowflake,
    "plumbing": Droplets,
    "electrical": Zap,
    "appliance-repair": Wrench,
    "beauty-salon": Scissors,
    "gardening": Leaf,
};

export function ServiceIcon({ serviceId, className, fallbackImage }: ServiceIconProps) {
    const Icon = serviceIcons[serviceId];

    if (Icon) {
        return <Icon className={className} />;
    }

    // If fallback image is a URL (not an emoji), render it
    if (fallbackImage && fallbackImage.startsWith("http")) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={fallbackImage} alt={serviceId} className={`object-cover ${className}`} />;
    }

    // Default icon if no mapping and no valid image URL
    return <Package className={className} />;
}
