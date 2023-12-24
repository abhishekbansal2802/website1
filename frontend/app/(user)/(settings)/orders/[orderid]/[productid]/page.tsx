"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {

    const { productid, orderid } = useParams()

    const [productDetails, setProductDetails] = useState<any>({})

    const getOrder = async () => {
        const response = await fetch(`http://localhost:8080/api/order/${localStorage.getItem("token")}/${orderid}/${productid}`)
        const res = await response.json()
        if (res.success) {
            console.log(res)
            setProductDetails({ ...res.product })
        }
    }

    const cancelOrder = async () => {
        const response = await fetch(
            `http://localhost:8080/api/order/cancel/${localStorage.getItem("token")}/${orderid}/${productid}`,
            {
                method: "PUT"
            }
        )
        const res = await response.json()
        if (res.success) {
            getOrder()
        }
    }

    useEffect(() => {

        getOrder()

    }, [])

    return <>

        <div className="w-full h-full pb-4 pr-4">
            <div className="w-full h-full bg-white rounded shadow-sm p-4">
                {
                    productDetails.product ? <div className="w-full h-full flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="text-3xl font-medium text-gray-700">
                                Order Statement
                            </div>
                            <div className="text-sm text-gray-500">
                                Your Order Statement
                            </div>
                        </div>
                        <div className="w-full bg-gray-50 p-4">
                            <div className="w-full gap-4 flex flex-row">
                                <div className=" flex-1 w-full">
                                    <div className="w-full h-full flex flex-col gap-3">
                                        <div className="flex flex-row gap-3">
                                            <div className="text-xs font-mediumm text-gray-700">
                                                OrderID :
                                            </div>
                                            <div className="text-xs font-medium text-gray-500">
                                                {orderid}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xl font-mediumm text-gray-700">
                                                Name
                                            </div>
                                            <div className="text-sm font-medium text-gray-500">
                                                {productDetails.name}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xl font-mediumm text-gray-700">
                                                Contact Number
                                            </div>
                                            <div className="text-sm font-medium text-gray-500">
                                                +91 {productDetails.contactNumber}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xl font-mediumm text-gray-700">
                                                Address
                                            </div>
                                            <div className="text-sm font-medium text-gray-500">
                                                <div>
                                                    {productDetails.address.flatNo}, {productDetails.address.society}, {productDetails.address.street},
                                                </div>
                                                <div>
                                                    {productDetails.address.city}, {productDetails.address.state}, {productDetails.address.pincode},
                                                </div>
                                                <div>
                                                    near {productDetails.address.landmark}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 flex gap-4 w-full ">
                                    <div className="flex-1 w-full aspect-square bg-white overflow-hidden rounded flex items-center justify-center">
                                        <img className="w-full" src={`http://localhost:8080/${productDetails.product._id}/${productDetails.product.mainImage.imageName}`} alt="" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex h-full flex-col gap-3">
                                            <div className="text-2xl font-medium text-gray-700 line-clamp-2 text-ellipsis">
                                                {productDetails.product.name}
                                            </div>
                                            <div className="text-lg line-clamp-2 text-ellipsis" >
                                                {productDetails.product.subtitle}
                                            </div>
                                            <div className="text-md font-light text-gray-500 ">
                                                <span>
                                                    $ {productDetails.product.price}
                                                </span>

                                            </div>
                                            <div>
                                                <span className="text-md font-light text-gray-500 ">
                                                    quantity : {productDetails.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1 h-full">

                                            </div>
                                            <div className="w-full h-12">
                                                <button disabled={productDetails.status == "cancelled"} onClick={() => { cancelOrder() }} className={`${productDetails.status == "cancelled" ? "bg-gray-100 text-gray-600 border-gray-600" : "bg-red-50 border-red-600 text-red-600"} border w-full h-full `}>
                                                    cancel
                                                </button>
                                            </div>
                                            <div className="text-sm text-gray-500 flex justify-center">
                                                <Link href="/">Need Help?</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="h-full w-full flex flex-col gap-4">
                            <div className="text-3xl text-gray-700 font-medium">
                                Order Status
                            </div>
                            <div className="w-full h-full flex-1 flex flex-row bg-gray-50">
                                {
                                    productDetails.status == "cancelled" ?
                                        <div className="flex justify-center items-center w-full h-full bg-red-50 border border-red-600 text-red-600">
                                            Cancelled
                                        </div>
                                        :
                                        <>
                                            <div className={`flex-1 w-full h-full flex justify-center bg-green-50 text-green-600 items-center border border-green-600`}>
                                                Confirmed
                                            </div>
                                            <div className={`flex-1 w-full h-full flex justify-center ${productDetails.status != "confirmed" ? "bg-green-50 border-green-600 text-green-600" : "border-gray-600"} border border-l-0 items-center`}>
                                                In - Transit
                                            </div>
                                            <div className={`flex-1 w-full h-full flex justify-center items-center ${productDetails.status == "delivered" ? "bg-green-50 border-green-600 text-green-600" : "border-gray-600"} border border-l-0 `}>
                                                Delivered
                                            </div>
                                        </>
                                }
                            </div>
                        </div>
                    </div> : null
                }
            </div>
        </div>

    </>

}
