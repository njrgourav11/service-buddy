"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type CartItem = {
    serviceId: string
    title: string
    price: number
    image: string
    packageType: string
}

type CartContextType = {
    items: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (serviceId: string, packageType: string) => void
    clearCart: () => void
    cartCount: number
    cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("serviceBuddyCart")
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (e) {
                console.error("Failed to parse cart from local storage", e)
            }
        }
    }, [])

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("serviceBuddyCart", JSON.stringify(items))
    }, [items])

    const addToCart = (item: CartItem) => {
        setItems((prev) => {
            // Check if item already exists
            const exists = prev.some(
                (i) => i.serviceId === item.serviceId && i.packageType === item.packageType
            )
            if (exists) return prev
            return [...prev, item]
        })
    }

    const removeFromCart = (serviceId: string, packageType: string) => {
        setItems((prev) =>
            prev.filter(
                (item) => !(item.serviceId === serviceId && item.packageType === packageType)
            )
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const cartCount = items.length
    const cartTotal = items.reduce((total, item) => total + item.price, 0)

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                clearCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
