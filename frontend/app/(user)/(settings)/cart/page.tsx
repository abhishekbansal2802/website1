"use client"

import { ProductCartCard } from "@/app/Components/client/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {

    const [cart, setCart] = useState<Array<any>>([])
    const [price, setPrice] = useState<any>({})

    const getCart = async () => {
        const response = await fetch(`http://localhost:8080/api/user/cart/${localStorage.getItem("token")}`)
        const res = await response.json()
        if (res.success) {
            setCart([...res.cart])
        }
    }

    const getPrice = async () => {
        const response = await fetch(`http://localhost:8080/api/user/cart/price/${localStorage.getItem("token")}`)
        const res = await response.json()
        if (res.success) {
            setPrice({ ...res.price })
        }
    }

    const router = useRouter()



    useEffect(() => {

        if (!localStorage.getItem("token")) {
            router.replace("/login")
            return
        }

        getCart()
        getPrice()
    }, [])

    return <>

        <div className="w-full h-full pb-4 pr-4 ">
            <div className="w-full h-full flex flex-row gap-4">
                <div className="flex-[3] h-full ">
                    <div className="bg-white shadow-sm rounded w-full h-full p-4">
                        <div className="flex h-full flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <div className="text-3xl font-medium text-gray-700">
                                    Cart
                                </div>
                                <div className="text-sm text-gray-500">
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
                    <div className="w-full h-full p-4 flex flex-col gap-6">
                        <div className="text-3xl font-medium text-gray-400">
                            Price List
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="w-full flex justify-between">
                                <span className="text-md text-gray-700">
                                    MRP ({cart.length} items)
                                </span>
                                <span className="text-md text-gray-500">
                                    {price.MRP}
                                </span>
                            </div>
                            <div className="w-full flex justify-between">
                                <span className="text-md text-gray-700">
                                    Delivery Charges
                                </span>
                                <span className="text-md text-gray-500">
                                    {price.delivery}
                                </span>
                            </div>
                            <div className="w-full flex justify-between">
                                <span className="text-md text-gray-700">
                                    Total
                                </span>
                                <span className="text-md text-gray-500">
                                    {price.subtotal}
                                </span>
                            </div>
                        </div>
                        <div className="w-full h-full flex-1">

                        </div>
                        <div className="w-full h-12 bg-slate-900 text-white uppercase flex items-center justify-center">
                            <Link href="/checkout">Checkout</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>
}