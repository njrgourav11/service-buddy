"use client"

import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"
import { ServiceIcon } from "@/components/service-icon"


export default function CartPage() {
    const { items, removeFromCart, cartTotal, clearCart } = useCart()
    const tax = Math.round(cartTotal * 0.18)
    const total = cartTotal + tax

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-full mb-6 shadow-sm">
                    <ShoppingBag className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
                    Looks like you haven't added any services yet. Browse our services to find what you need.
                </p>
                <Button asChild size="lg" className="rounded-full px-8">
                    <Link href="/services">Browse Services</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item, index) => (
                            <Card key={`${item.serviceId}-${item.packageType}-${index}`} className="overflow-hidden">
                                <CardContent className="p-0 flex flex-col sm:flex-row">
                                    <div className="w-full sm:w-32 h-32 bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                        <ServiceIcon
                                            serviceId={item.serviceId}
                                            className="h-12 w-12 text-gray-400"
                                            fallbackImage={item.image}
                                        />
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{item.title}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">Package: {item.packageType}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                onClick={() => removeFromCart(item.serviceId, item.packageType)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex justify-between items-end mt-4">
                                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">₹{item.price}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <div className="flex justify-end">
                            <Button variant="outline" onClick={clearCart} className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">
                                Clear Cart
                            </Button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal ({items.length} items)</span>
                                    <span className="font-medium">₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Taxes (18% GST)</span>
                                    <span className="font-medium">₹{tax}</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between items-center">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-xl text-blue-600 dark:text-blue-400">₹{total}</span>
                                </div>

                                <Button asChild className="w-full mt-6" size="lg">
                                    <Link href="/checkout">
                                        Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
