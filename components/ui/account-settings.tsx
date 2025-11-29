import React from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { AvatarUploader } from './avatar-uploader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Star, Trash2, Plus, Pencil, Map, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/MapPicker'), {
    ssr: false,
    loading: () => <p>Loading Map...</p>
});

interface AccountSettingsProps {
    user: any;
    bookings: any[];
    addresses: any[];
    loadingBookings: boolean;
    loadingAddresses: boolean;
    onUpdateProfile: (data: any) => Promise<void>;
    onUploadAvatar: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
    onAddAddress: (data: any) => Promise<void>;
    onDeleteAddress: (id: string) => Promise<void>;
    onReview: (bookingId: string) => void;
}

export function AccountSettings({
    user,
    bookings,
    addresses,
    loadingBookings,
    loadingAddresses,
    onUpdateProfile,
    onUploadAvatar,
    onAddAddress,
    onDeleteAddress,
    onReview
}: AccountSettingsProps) {
    const [photo, setPhoto] = React.useState<string>(user?.photoURL || '');
    const [displayName, setDisplayName] = React.useState(user?.displayName || '');
    const [phone, setPhone] = React.useState(user?.phoneNumber || '');

    // Address Form State
    const [isAddingAddress, setIsAddingAddress] = React.useState(false);
    const [addressForm, setAddressForm] = React.useState({ title: "", addressLine1: "", addressLine2: "", city: "", state: "", zip: "" });
    const [showMap, setShowMap] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);

    const handleUpload = async (file: File) => {
        // Optimistic update
        const objectUrl = URL.createObjectURL(file);
        setPhoto(objectUrl);

        const result = await onUploadAvatar(file);
        if (result.success && result.url) {
            setPhoto(result.url);
            return { success: true };
        } else {
            console.error("Upload failed:", result.error);
            return { success: false, error: result.error };
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await onUpdateProfile({ displayName, phone });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveAddress = async () => {
        // Construct full address for backward compatibility
        const fullAddress = `${addressForm.addressLine1}, ${addressForm.addressLine2 ? addressForm.addressLine2 + ', ' : ''}${addressForm.city}, ${addressForm.state} - ${addressForm.zip}`;

        await onAddAddress({
            ...addressForm,
            address: fullAddress,
            addressLine1: addressForm.addressLine1,
            addressLine2: addressForm.addressLine2,
            city: addressForm.city,
            state: addressForm.state,
            zip: addressForm.zip
        });
        setIsAddingAddress(false);
        setAddressForm({ title: "", addressLine1: "", addressLine2: "", city: "", state: "", zip: "" });
        setShowMap(false);
    };

    const handleLocationSelect = (location: { lat: number; lng: number; address: string; addressDetails?: any }) => {
        const details = location.addressDetails || {};
        const city = details.city || details.town || details.village || details.suburb || "";
        const zip = details.postcode || "";
        const state = details.state || "";

        const street = details.road || "";
        const houseNumber = details.house_number || "";
        const area = details.suburb || details.neighbourhood || "";

        const addressLine1 = [houseNumber, street].filter(Boolean).join(", ");
        const addressLine2 = area;

        setAddressForm(prev => ({
            ...prev,
            addressLine1: addressLine1 || location.address,
            addressLine2,
            city,
            state,
            zip
        }));
        setShowMap(false);
    };

    return (
        <section className="relative min-h-screen w-full px-4 py-10">
            <div
                aria-hidden
                className="absolute inset-0 isolate -z-10 opacity-80 contain-strict"
            >
                <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full" />
                <div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full" />
                <div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 rounded-full" />
            </div>
            <div className="mx-auto w-full max-w-4xl space-y-8">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold">Account Settings</h2>
                    <p className="text-muted-foreground text-base">
                        Manage account, bookings, and your personal information.
                    </p>
                </div>
                <Separator />

                <div className="py-2">
                    <SectionColumns
                        title="Your Avatar"
                        description="An avatar is optional but strongly recommended."
                    >
                        <AvatarUploader onUpload={handleUpload}>
                            <Avatar className="relative mx-auto h-20 w-20 cursor-pointer hover:opacity-50">
                                <AvatarImage src={photo} />
                                <AvatarFallback className="border text-2xl font-bold">
                                    {user?.displayName?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                        </AvatarUploader>
                    </SectionColumns>
                    <Separator />

                    <SectionColumns
                        title="Personal Info"
                        description="Update your personal details here."
                    >
                        <div className="w-full space-y-4">
                            <div className="space-y-1">
                                <Label>Full Name</Label>
                                <Input
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Enter Your Name"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Phone Number</Label>
                                <Input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter Phone Number"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Email</Label>
                                <Input value={user?.email} disabled className="bg-muted" />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    variant="outline"
                                    className="text-xs md:text-sm"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </SectionColumns>
                    <Separator />

                    <SectionColumns
                        title="Your Addresses"
                        description="Manage your saved delivery addresses."
                    >
                        <div className="space-y-4">
                            {loadingAddresses ? (
                                <p>Loading addresses...</p>
                            ) : addresses.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No addresses saved yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {addresses.map((addr) => (
                                        <div key={addr.id} className="border rounded-lg p-4 relative group bg-card">
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => onDeleteAddress(addr.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <h4 className="font-bold mb-1">{addr.title}</h4>
                                            {addr.addressLine1 ? (
                                                <>
                                                    <p className="text-sm text-muted-foreground">{addr.addressLine1}</p>
                                                    {addr.addressLine2 && <p className="text-sm text-muted-foreground">{addr.addressLine2}</p>}
                                                    <p className="text-sm text-muted-foreground mt-1">{addr.city}, {addr.state} - {addr.zip}</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm text-muted-foreground">{addr.address}</p>
                                                    <p className="text-sm text-muted-foreground mt-1">{addr.city}, {addr.zip}</p>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Plus className="h-4 w-4 mr-2" /> Add New Address
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Add New Address</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Address Title</Label>
                                            <Input
                                                id="title"
                                                placeholder="Home, Office, etc."
                                                value={addressForm.title}
                                                onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label>Address Details</Label>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 text-xs"
                                                    onClick={() => setShowMap(!showMap)}
                                                >
                                                    <Map className="h-3 w-3 mr-1" />
                                                    {showMap ? "Hide Map" : "Select on Map"}
                                                </Button>
                                            </div>

                                            {showMap && (
                                                <div className="mb-4 border rounded-md overflow-hidden">
                                                    <MapPicker onLocationSelect={handleLocationSelect} />
                                                </div>
                                            )}

                                            <div className="grid gap-3">
                                                <div className="space-y-1">
                                                    <Label htmlFor="addressLine1" className="text-xs text-muted-foreground">Address Line 1</Label>
                                                    <Input
                                                        id="addressLine1"
                                                        placeholder="House No., Building, Street"
                                                        value={addressForm.addressLine1}
                                                        onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor="addressLine2" className="text-xs text-muted-foreground">Address Line 2 (Optional)</Label>
                                                    <Input
                                                        id="addressLine2"
                                                        placeholder="Area, Colony, Landmark"
                                                        value={addressForm.addressLine2}
                                                        onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="city">City</Label>
                                                <Input
                                                    id="city"
                                                    placeholder="City"
                                                    value={addressForm.city}
                                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="state">State</Label>
                                                <Input
                                                    id="state"
                                                    placeholder="State"
                                                    value={addressForm.state}
                                                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2 col-span-2 md:col-span-1">
                                                <Label htmlFor="zip">Pincode</Label>
                                                <Input
                                                    id="zip"
                                                    placeholder="Pincode"
                                                    value={addressForm.zip}
                                                    onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleSaveAddress}>Save Address</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </SectionColumns>
                    <Separator />

                    <SectionColumns
                        title="Your Bookings"
                        description="View and manage your service bookings."
                    >
                        <div className="space-y-4">
                            {loadingBookings ? (
                                <p>Loading bookings...</p>
                            ) : bookings.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No bookings found.</p>
                            ) : (
                                bookings.map((booking) => (
                                    <Card key={booking.id} className="overflow-hidden">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                                <div className="space-y-2 w-full">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-bold text-lg">{booking.serviceName}</h3>
                                                        <Badge className={
                                                            booking.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                                                booking.status === "confirmed" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                                                                    booking.status === "accepted" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" :
                                                                        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                        }>
                                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Calendar className="h-4 w-4 mr-1" />
                                                        {new Date(booking.date).toLocaleDateString()}
                                                        <Clock className="h-4 w-4 ml-4 mr-1" />
                                                        {new Date(booking.date).toLocaleTimeString()}
                                                    </div>
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        {booking.address}
                                                    </div>

                                                    {booking.status === "accepted" && booking.technicianName && (
                                                        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
                                                            <p className="text-xs text-blue-800 dark:text-blue-300 font-semibold mb-2">Assigned Technician</p>
                                                            <div className="flex items-center">
                                                                <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-sm font-bold mr-3 text-blue-800">
                                                                    {booking.technicianName[0]}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium">{booking.technicianName}</p>
                                                                    <p className="text-xs text-muted-foreground">{booking.technicianPhone}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end">
                                                    <p className="font-bold text-lg">₹{booking.amount}</p>

                                                    {booking.status === "completed" && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="mt-0 md:mt-4"
                                                            onClick={() => onReview(booking.id)}
                                                        >
                                                            <Star className="mr-2 h-4 w-4" /> Review
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </SectionColumns>
                </div>
            </div>
        </section >
    );
}

interface SectionColumnsType {
    title: string;
    description?: string;
    className?: string;
    children: React.ReactNode;
}

function SectionColumns({
    title,
    description,
    children,
    className,
}: SectionColumnsType) {
    return (
        <div className="animate-in fade-in grid grid-cols-1 gap-x-10 gap-y-4 py-8 duration-500 md:grid-cols-10">
            <div className="w-full space-y-1.5 md:col-span-4">
                <h2 className="font-heading text-lg leading-none font-semibold">
                    {title}
                </h2>
                <p className="text-muted-foreground text-sm text-balance">
                    {description}
                </p>
            </div>
            <div className={cn('md:col-span-6', className)}>{children}</div>
        </div>
    );
}
