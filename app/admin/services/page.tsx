"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getServicesForAdmin, createService, updateService, deleteService } from "@/actions/service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Package, Loader2 } from "lucide-react";
import { ServiceIcon } from "@/components/service-icon";

export default function AdminServicesPage() {
    const { user, loading: authLoading } = useAuth();
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Service Modal State
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);
    const [serviceFormData, setServiceFormData] = useState({
        title: "",
        category: "",
        price: "",
        description: "",
        image: ""
    });
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const token = await user.getIdToken(true);
                    const result = await getServicesForAdmin(token);
                    if (result.success) {
                        setServices(result.services || []);
                    }
                } catch (error) {
                    console.error("Error fetching services:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (!authLoading) {
            fetchServices();
        }
    }, [user, authLoading]);

    const handleServiceSubmit = async () => {
        if (!user) return;
        setActionLoading(true);
        try {
            const token = await user.getIdToken();
            const payload = {
                ...serviceFormData,
                price: Number(serviceFormData.price)
            };

            let result;
            if (editingService) {
                result = await updateService(editingService.id, payload, token);
            } else {
                result = await createService(payload, token);
            }

            if (result.success) {
                setIsServiceModalOpen(false);
                setEditingService(null);
                setServiceFormData({ title: "", category: "", price: "", description: "", image: "" });
                // Refresh services
                const servicesRes = await getServicesForAdmin(token);
                if (servicesRes.success) setServices(servicesRes.services || []);
            } else {
                alert("Failed to save service: " + result.error);
            }
        } catch (error) {
            console.error("Error saving service:", error);
            alert("Failed to save service");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteService = async (id: string) => {
        if (!user || !confirm("Are you sure you want to delete this service?")) return;
        try {
            const token = await user.getIdToken();
            const result = await deleteService(id, token);
            if (result.success) {
                setServices(prev => prev.filter(s => s.id !== id));
            } else {
                alert("Failed to delete service: " + result.error);
            }
        } catch (error) {
            console.error("Error deleting service:", error);
        }
    };

    const openServiceModal = (service?: any) => {
        if (service) {
            setEditingService(service);
            setServiceFormData({
                title: service.title,
                category: service.category,
                price: service.price.toString(),
                description: service.description,
                image: service.image || ""
            });
        } else {
            setEditingService(null);
            setServiceFormData({ title: "", category: "", price: "", description: "", image: "" });
        }
        setIsServiceModalOpen(true);
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Services</h2>
                <p className="text-muted-foreground">Manage services offered on the platform</p>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Services List</CardTitle>
                        <CardDescription>View and manage all services</CardDescription>
                    </div>
                    <Button onClick={() => openServiceModal()}>
                        <Plus className="mr-2 h-4 w-4" /> Add Service
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map(service => (
                            <Card key={service.id} className="overflow-hidden">
                                <div className="h-32 bg-gray-100 relative flex items-center justify-center">
                                    <ServiceIcon
                                        serviceId={service.id}
                                        className="h-16 w-16 text-gray-500"
                                        fallbackImage={service.image}
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-semibold">{service.title}</h3>
                                            <p className="text-xs text-gray-500 capitalize">{service.category}</p>
                                        </div>
                                        <Badge variant="secondary">₹{service.price}</Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                        {service.description}
                                    </p>
                                    <div className="flex justify-end space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => openServiceModal(service)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Service Create/Edit Modal */}
            <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Service Title</Label>
                                <Input
                                    id="title"
                                    value={serviceFormData.title}
                                    onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                                    placeholder="e.g. AC Repair"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={serviceFormData.category}
                                    onValueChange={(val) => setServiceFormData({ ...serviceFormData, category: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="plumbing">Plumbing</SelectItem>
                                        <SelectItem value="electrical">Electrical</SelectItem>
                                        <SelectItem value="hvac">HVAC</SelectItem>
                                        <SelectItem value="cleaning">Cleaning</SelectItem>
                                        <SelectItem value="appliance">Appliance</SelectItem>
                                        <SelectItem value="carpentry">Carpentry</SelectItem>
                                        <SelectItem value="painting">Painting</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (₹)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={serviceFormData.price}
                                    onChange={(e) => setServiceFormData({ ...serviceFormData, price: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Image URL</Label>
                                <Input
                                    id="image"
                                    value={serviceFormData.image}
                                    onChange={(e) => setServiceFormData({ ...serviceFormData, image: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={serviceFormData.description}
                                onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                                placeholder="Brief description of the service"
                            />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => setIsServiceModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleServiceSubmit} disabled={actionLoading}>
                                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                {editingService ? "Update Service" : "Create Service"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    );
}
