"use client"

import { PriceFeedForCart, ProductCartCard } from "@/app/Components/client/client"
import { useEffect, useState } from "react"

export default function Page() {

    const [cart, setCart] = useState<Array<any>>([])

    const getCart = async () => {
        const response = await fetch(`http://localhost:8080/api/user/cart/${localStorage.getItem("token")}`)
        const res = await response.json()
        if (res.success) {
            setCart([...res.cart])
        }
    }

    useEffect(() => {
        getCart()
    }, [])

    return <>

        <div className="w-full h-full pb-4 pr-4 ">
            <div className="w-full h-full flex flex-row gap-4">
                <div className="flex-[3] h-full ">
                    <div className="bg-white shadow-sm rounded w-full h-full p-4">
                        <div className="flex h-full flex-col gap-6">
                            <div>
                                <div className="text-3xl font-medium text-gray-700">
                                    Cart
                                </div>
                                <div className="text-sm font-light text-gray-590">
                                    product in your cart
                                </div>
                            </div>
                            <div className="w-full h-full flex flex-col gap-6 overflow-y-scroll">
                                {cart.map((e) => <ProductCartCard update={getCart} productId={e.productId} quantity={e.quantity} />)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 w-full h-full bg-white shadow-sm rounded">
                    <PriceFeedForCart />
                </div>
            </div>
        </div>

    </>
}