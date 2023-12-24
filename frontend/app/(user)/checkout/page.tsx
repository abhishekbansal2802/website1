"use client"

import { AddressCard, ProductCartCard } from "@/app/Components/client/client"
import { closeSVG } from "@/app/icons/icons"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {

    const [address, setAddress] = useState<any>()
    const [newAddress, setNewAddress] = useState<boolean>(false)
    const [allAdress, setAllAddress] = useState<any>([])
    const [cart, setCart] = useState<Array<any>>([])
    const [price, setPrice] = useState<any>({})

    const getAddress = async () => {
        const response = await fetch(
            `http://localhost:8080/api/address/${localStorage.getItem("token")}`
        )
        const res = await response.json()
        if (res.success) {
            if (res.address.length == 0) {
                router.push("/address")
            }
            setAllAddress([...res.address])
        }
    }
    const getUserCart = async () => {

        const response = await fetch(
            `http://localhost:8080/api/user/cart/${localStorage.getItem("token")}`,
        )

        const res = await response.json()
        if (res.success) {
            setCart([...res.cart])
        }


    }

    const completeOrder = async () => {
        const response = await fetch(
            "http://localhost:8080/api/order/create/cart",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        token: localStorage.getItem("token")
                    }
                )
            }
        )
        const res = await response.json()
        if (res.success) {
            router.replace("/")
            return
        }
    }

    const setSelectedAddress = async (id: string) => {
        const response = await fetch(
            `http://localhost:8080/api/user/selected/address/${localStorage.getItem("token")}/${id}`,
            {
                method: "PUT"
            }
        )
        const res = await response.json()
        if (res.success) {
            setNewAddress(false)
            getUserSelectedAddress()
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

    const getUserSelectedAddress = async () => {
        const response = await fetch(`http://localhost:8080/api/user/selected/address/${localStorage.getItem("token")}`)
        const res = await response.json()
        if (res.success) {
            setAddress(res.address)
        }
    }

    useEffect(() => {
        getUserSelectedAddress()
    }, [])

    useEffect(() => {
        getAddress()
        getUserCart()
        getPrice()
    }, [newAddress])

    return <>
        {newAddress ? <div className="w-full h-full z-10 bg-black bg-opacity-60 absolute top-0 left-0 flex justify-center items-center">

            <div className="w-1/2 p-4 bg-white rounded">
                <div className="w-full h-full flex flex-col relative gap-4">
                    <div className="absolute top-0 right-0">
                        <button onClick={() => { setNewAddress(false) }}>
                            {closeSVG}
                        </button>
                    </div>
                    <div className="text-2xl font-medium text-gray-700">
                        All Address
                    </div>

                    <div>
                        {
                            allAdress.map((e: any) => <div onClick={() => { setSelectedAddress(e._id) }}>
                                <AddressCard remove={false} address={e} appendAddress={getAddress} />
                            </div>)
                        }
                    </div>

                    <div className="">

                    </div>
                </div>
            </div>

        </div> : null}
        <div className="w-full h-full px-4 pb-4">
            <div className="w-full p-4 h-full bg-white shadow-sm rounded">
                <div className="h-full w-full">
                    <div className="w-full h-full flex flex-row gap-4">
                        <div className="flex-[3] w-full h-full flex flex-col gap-4">
                            <div className="flex-1 flex flex-col gap-2 w-full h-full ">
                                <div className="text-3xl font-medium text-gray-700">
                                    Address
                                </div>
                                <div className="w-full h-full">
                                    {address ?
                                        <div className="text-sm text-gray-700 flex flex-col gap-1">
                                            <div>
                                                {address.flatNo}, {address.society}, {address.street},
                                            </div>
                                            <div>
                                                {address.city}, {address.state}, {address.pincode}
                                            </div>
                                            <div>
                                                near {address.landmark}
                                            </div>
                                        </div>
                                        :
                                        <div className="w-full h-full border border-dashed border-slate-900">
                                            <button className="w-full h-full text-lg text-gray-700" onClick={() => { setNewAddress(true) }}>
                                                + Add Address
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="flex-[2] w-full h-full">
                                <div className="flex flex-col gap-4">
                                    <div className="text-3xl font-medium text-gray-700">
                                        Cart
                                    </div>
                                    <div className="flex flex-col gap-2 w-full h-full overflow-y-scroll">
                                        {
                                            cart.map((e) => <ProductCartCard productId={e.productId} quantity={e.quantity} update={() => { getUserCart(); getPrice() }} />)
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full h-full">
                            <div className="flex flex-col gap-4 w-full h-full">
                                <div className="text-3xl font-medium text-gray-700">
                                    Price List
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="w-full flex flex-row justify-between text-sm font-medium">
                                        <span className="text-gray-700">
                                            MRP ({cart.length} items)
                                        </span>
                                        <span>
                                            {price.MRP}
                                        </span>
                                    </div>
                                    <div className="w-full flex flex-row justify-between text-sm font-medium">
                                        <span className="text-gray-700">
                                            Delivery
                                        </span>
                                        <span>
                                            {price.delivery}
                                        </span>
                                    </div>
                                    <div className="w-full flex flex-row justify-between text-sm font-medium">
                                        <span className="text-gray-700">
                                            Subtotal
                                        </span>
                                        <span>
                                            {price.subtotal}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 h-full w-full">

                                </div>
                                <div className="">
                                    <button onClick={() => { completeOrder() }} className="w-full h-12 uppercase bg-slate-900 text-white uppercase">
                                        proceed to payment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>
}