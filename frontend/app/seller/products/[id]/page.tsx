"use client"

import { doneTagSVG, editTagSVG, plusSVG } from "@/app/icons/icons"
import axios from "axios"
import { GOOGLE_FONT_PROVIDER } from "next/dist/shared/lib/constants"
import { Odor_Mean_Chey } from "next/font/google"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"


export default function Page() {

    const params = useParams()

    const [product, setProduct] = useState<any>(
        {
            name: "",
            price: "",
            stock: "",
            rating: "",
            subtitle: "",
            _id: "",
            highlights: []
        }
    )

    const [seller, setSeller] = useState<any>(
        {
            name: "",
            email: "",
            contact: "",
            _id: "",
        }
    )

    const [productNameEdit, setProductNameEdit] = useState<boolean>(false)
    const [productSubtitleEdit, setProductSubtitleEdit] = useState<boolean>(false)
    const [productPriceEdit, setProductPriceEdit] = useState<boolean>(false)
    const [productStockEdit, setProductStockEdit] = useState<boolean>(false)
    const [highlight, setHighlight] = useState<string>("")
    const [image1, setImage1] = useState<Blob>()
    const [image2, setImage2] = useState<Blob>()
    const [image3, setImage3] = useState<Blob>()
    const [image4, setImage4] = useState<Blob>()
    const [image5, setImage5] = useState<Blob>()
    const [featureImage, setFeatureImage] = useState<Blob>()
    const [features, setFeatures] = useState({
        title: "",
        content: "",
    })

    const getProduct = async () => {
        const response = await fetch(`http://localhost:8080/api/product/${localStorage.getItem("token")}/${params.id}`)
        const res = await response.json()
        console.log(res)
        if (res.success) {
            setProduct({ ...product, ...res.product })
        }
    }

    const getSeller = async () => {
        const response = await fetch(`http://localhost:8080/api/seller/${params.id}`)
        const res = await response.json()
        if (res.success) {
            setSeller({ ...res.data })
        }
    }

    const setProductName = async () => {
        const response = await fetch(
            `http://localhost:8080/api/product/set/name/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        token: localStorage.getItem("token"),
                        id: params.id,
                        name: product?.name
                    }
                )
            }
        )
        const res = await response.json()
        console.log(res)
        if (res.success) {
            setProductNameEdit(false)
            getProduct()
        }
    }

    const setProductSubtitle = async () => {
        const response = await fetch(
            `http://localhost:8080/api/product/set/subtitle/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        token: localStorage.getItem("token"),
                        id: params.id,
                        subtitle: product?.subtitle
                    }
                )
            }
        )
        const res = await response.json()
        console.log(res)
        if (res.success) {
            setProductSubtitleEdit(false)
            getProduct()
        }
    }

    const setProductPrice = async () => {

        const response = await fetch(
            `http://localhost:8080/api/product/set/price/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        token: localStorage.getItem("token"),
                        id: params.id,
                        price: product?.price
                    }
                )
            }
        )
        const res = await response.json()
        console.log(res)
        if (res.success) {
            setProductPriceEdit(false)
            getProduct()
        }

    }

    const setProductStock = async () => {

        const response = await fetch(
            `http://localhost:8080/api/product/set/stock/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        token: localStorage.getItem("token"),
                        id: params.id,
                        stock: product?.stock
                    }
                )
            }
        )
        const res = await response.json()
        console.log(res)
        if (res.success) {
            setProductStockEdit(false)
            getProduct()
        }
    }

    const submitHighlights = async () => {
        const response = await fetch(
            `http://localhost:8080/api/product/set/highlight`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        token: localStorage.getItem("token"),
                        id: params.id,
                        highlight: highlight
                    }
                )
            }
        )
        const res = await response.json()
        if (res.success) {
            getProduct()
            setHighlight("")
        }
    }

    const sendFeatures = async () => {

        if (featureImage == undefined || features.title == "" || features.content == "") return

        const formData = new FormData()
        formData.append("token", localStorage.getItem("token") as string)
        formData.append("id", params.id as string)
        formData.append("title", features.title)
        formData.append("content", features.content)
        formData.append("image", featureImage as Blob)

        const response = await axios.post("http://localhost:8080/api/product/upload/features", formData)
        if (response.data.success) {
            getProduct()
            setFeatureImage(undefined)
            setFeatures(
                {
                    title: "",
                    content: ""
                }
            )
        }


    }

    const uploadMainImage = async () => {
        const formData = new FormData()
        formData.append("token", localStorage.getItem("token") as string)
        formData.append("id", params.id as string)
        formData.append("image", image1 as Blob)
        const response = await axios.post("http://localhost:8080/api/product/upload/mainImage", formData)
        console.log(response.data)
    }

    const uploadImage2 = async () => {
        const formData = new FormData()
        formData.append("token", localStorage.getItem("token") as string)
        formData.append("id", params.id as string)
        formData.append("image", image2 as Blob)
        const response = await axios.post("http://localhost:8080/api/product/upload/image2", formData)
        console.log(response.data)
    }

    const uploadImage3 = async () => {
        const formData = new FormData()
        formData.append("token", localStorage.getItem("token") as string)
        formData.append("id", params.id as string)
        formData.append("image", image3 as Blob)
        const response = await axios.post("http://localhost:8080/api/product/upload/image3", formData)
        console.log(response.data)
    }

    const uploadImage4 = async () => {
        const formData = new FormData()
        formData.append("token", localStorage.getItem("token") as string)
        formData.append("id", params.id as string)
        formData.append("image", image4 as Blob)
        const response = await axios.post("http://localhost:8080/api/product/upload/image4", formData)
        console.log(response.data)
    }

    const uploadImage5 = async () => {
        const formData = new FormData()
        formData.append("token", localStorage.getItem("token") as string)
        formData.append("id", params.id as string)
        formData.append("image", image5 as Blob)
        const response = await axios.post("http://localhost:8080/api/product/upload/image5", formData)
        console.log(response.data)
    }

    const uploadFiles = async () => {
        if (image1) uploadMainImage()
        if (image2) uploadImage2()
        if (image3) uploadImage3()
        if (image4) uploadImage4()
        if (image5) uploadImage5()
    }

    useEffect(() => {
        getProduct()
        getSeller()
    }, [])

    const listProduct = async () => {
        const response = await fetch(
            `http://localhost:8080/api/seller/list/${params.id}/${localStorage.getItem("token")}`,
            {
                method: "PUT"
            }
        )
        const res = await response.json()
        if (res.success) {
            alert("product listed")
        }
    }

    const delistProduct = async () => {
        const response = await fetch(
            `http://localhost:8080/api/seller/delist/${params.id}/${localStorage.getItem("token")}`,
            {
                method: "PUT"
            }
        )
        const res = await response.json()
        if (res.success) {
            alert("product delisted")
        }
    }

    return <>

        <div className="w-full h-full px-4 pb-4 flex flex-col gap-4">
            <div className="w-full h-full bg-white rounded shadow-sm p-4 flex flex-row justify-between items-center" >
                <div>
                    Ready to list the product?
                </div>
                <div>
                    <div className="flex flex-row gap-4">
                        <button onClick={() => { listProduct() }} className="px-4 py-2 rounded bg-green-100">
                            <span className="text-green-600">
                                Yes
                            </span>
                        </button>
                        <button onClick={() => { delistProduct() }} className="px-4 py-2 rounded bg-red-100">
                            <span className="text-red-600">
                                No
                            </span>
                        </button>
                    </div>
                    <div>

                    </div>
                </div>

            </div>
            <div className="w-full h-full bg-white shadow-sm rounded p-4 flex flex-col gap-4">
                <div className="w-full h-full flex flex-row gap-4">
                    <div className="flex-1 w-full h-full p-4">
                        <div className="flex flex-col gap-4 w-full h-full">
                            <div className="w-full aspect-square border border-dashed border-slate-900">
                                <label htmlFor="mainImage" className="w-full h-full flex justify-center items-center">{image1 ? <img src={URL.createObjectURL(image1)} /> : product.mainImage ? <img src={`http://localhost:8080/${params.id}/${product.mainImage.imageName}`} /> : "+"}</label>
                                <input
                                    type="file"
                                    className="hidden"
                                    id="mainImage"
                                    onChange={(e) => {
                                        setImage1(e.target.files?.[0])
                                    }}
                                />
                            </div>
                            <div className="flex flex-row gap-1">
                                <div className="flex-1 w-full aspect-square border border-dashed border-slate-900">
                                    <label htmlFor="image2" className="flex justify-center items-center w-full h-full">
                                        {
                                            image2 ? <img src={URL.createObjectURL(image2)} /> : product.images?.image1 ? <img src={`http://localhost:8080/${params.id}/${product.images.image1.imageName}`} /> : "+"
                                        }
                                    </label>
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="image2"
                                        onChange={(e) => { setImage2(e.target.files?.[0]) }}
                                    />
                                </div>
                                <div className="flex-1 w-full aspect-square border border-dashed border-slate-900">
                                    <label htmlFor="image3" className="flex justify-center items-center w-full h-full">
                                        {
                                            image3 ? <img src={URL.createObjectURL(image3)} /> : product.images?.image2 ? <img src={`http://localhost:8080/${params.id}/${product.images.image2.imageName}`} /> : "+"

                                        }
                                    </label>
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="image3"
                                        onChange={(e) => { setImage3(e.target.files?.[0]) }}
                                    />
                                </div>
                                <div className="flex-1 w-full aspect-square border border-dashed border-slate-900">
                                    <label htmlFor="image4" className="flex justify-center items-center w-full h-full">
                                        {
                                            image4 ? <img src={URL.createObjectURL(image4)} /> : product.images?.image3 ? <img src={`http://localhost:8080/${params.id}/${product.images.image3.imageName}`} /> : "+"
                                        }
                                    </label>
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="image4"
                                        onChange={(e) => { setImage4(e.target.files?.[0]) }}
                                    />
                                </div>
                                <div className="flex-1 w-full aspect-square border border-dashed border-slate-900">
                                    <label htmlFor="image5" className="flex justify-center items-center w-full h-full">
                                        {
                                            image5 ? <img src={URL.createObjectURL(image5)} /> : product.images?.image4 ? <img src={`http://localhost:8080/${params.id}/${product.images.image4.imageName}`} /> : "+"

                                        }
                                    </label>
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="image5"
                                        onChange={(e) => { setImage5(e.target.files?.[0]) }}
                                    />
                                </div>
                            </div>
                            <div className="w-full">
                                <button onClick={() => { uploadFiles() }} className="w-full h-12 bg-slate-900 text-white uppercase">upload</button>
                            </div>

                        </div>
                    </div>
                    <div className="flex-[2] w-full h-full">
                        <div className="w-full h-full p-4 flex flex-col gap-3">
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-row gap-3 items-center text-3xl font-medium text-gray-700">
                                    {
                                        productNameEdit ? <input type="text" placeholder="Enter new product name" value={product?.name} onChange={(e) => { setProduct({ ...product, name: e.target.value }) }} className="w-full outline-none" /> : <span className="text-3xl font-medium text-gray-700">
                                            {product?.name}
                                        </span>
                                    }
                                    {
                                        productNameEdit ? <span className="scale-75 cursor-pointer" onClick={() => { setProductName() }}>
                                            {doneTagSVG}
                                        </span> : <span className="scale-75 cursor-pointer" onClick={() => { setProductNameEdit(true) }}>
                                            {editTagSVG}
                                        </span>
                                    }
                                </div>
                                <div className="flex flex-row gap-3 items-cente text-md font-normal text-gray-700">
                                    {
                                        productSubtitleEdit ? <input type="text" placeholder="Enter new product subtitle" value={product?.subtitle} onChange={(e) => { setProduct({ ...product, subtitle: e.target.value }) }} className="w-full outline-none" /> : <span className="text-md font-normal text-gray-700">
                                            {product?.subtitle}
                                        </span>
                                    }
                                    {
                                        productSubtitleEdit ? <span className="scale-75 cursor-pointer" onClick={() => { setProductSubtitle() }}>
                                            {doneTagSVG}
                                        </span> : <span className="scale-75 cursor-pointer" onClick={() => { setProductSubtitleEdit(true) }}>
                                            {editTagSVG}
                                        </span>
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex-1 text-lg font-extralight flex flex-row gap-2 items-center">
                                    <span className="text-4xl font-medium text-gray-600">
                                        $
                                    </span>
                                    {" "}
                                    <div>
                                        {
                                            productPriceEdit ? <input type="tel" value={product?.price} onChange={(e) => { setProduct({ ...product, price: e.target.value }) }} className="w-full h-12 outline-none bg-gray-50 border text-4xl font-medium text-gray-600 border-slate-300 p-2" /> : <span className="text-4xl font-medium text-gray-600">
                                                {product.price}
                                            </span>
                                        }
                                    </div>
                                    <div>
                                        {
                                            productPriceEdit ? <span className="scale-75 cursor-pointer" onClick={() => { setProductPrice() }}>
                                                {doneTagSVG}
                                            </span> : <span className="scale-75 cursor-pointer" onClick={() => { setProductPriceEdit(true) }}>
                                                {editTagSVG}
                                            </span>
                                        }
                                    </div>
                                </div>
                                <div className="flex-1 text-lg font-extralight flex flex-row gap-2 items-center">
                                    <span>
                                        Hurry only
                                    </span>
                                    <div>
                                        {
                                            productStockEdit ? <input type="tel" value={product?.stock} onChange={(e) => { setProduct({ ...product, stock: e.target.value }) }} className="w-full h-12 outline-none bg-gray-50 border border-slate-300 p-2" /> : `${product.stock} left`
                                        }
                                    </div>
                                    <div>
                                        {
                                            productStockEdit ? <span className="scale-75 cursor-pointer" onClick={() => { setProductStock() }}>
                                                {doneTagSVG}
                                            </span> : <span className="scale-75 cursor-pointer" onClick={() => { setProductStockEdit(true) }}>
                                                {editTagSVG}
                                            </span>
                                        }
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3 text-3xl font-medium text-gray-700">
                                        Highlights

                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex flex-col gap-2">
                                            {product.highlights.map((e: any) => <div>{e}</div>)}
                                        </div>
                                        <div className="flex flex-row gap-3 items-center">
                                            <input type="text" value={highlight} onChange={(e) => { setHighlight(e.target.value) }} placeholder="enter more highlights here" className="w-full outline-none" />
                                            <div
                                                onClick={() => {
                                                    submitHighlights()
                                                }}
                                                className="cursor-pointer w-10 h-10 text-2xl border-2 border-gray-700 flex justify-center items-center rounded-full"
                                            >
                                                <span className="">
                                                    +
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1">

                            </div>
                            <div className="flex flex-col gap-3">
                                <button className="w-full h-12 uppercase bg-slate-900 text-white">
                                    add to cart
                                </button>
                                <button className="w-full h-12 uppercase border border-slate-900 text-slate-900">
                                    buy now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-4">
                    <div className="w-fit mx-auto text-2xl font-medium text-gray-700">
                        Features
                    </div>
                    <div className="w-full">
                        <div className="w-full flex flex-col gap-3">
                            {product.features && product.features.length > 0 ? <div className="w-full border border-slate-300">

                                {product.features.map((e: any) => <FeatureMap product={e} />)}

                            </div> : null}
                            <div className="w-full h-64 border border-dashed border-slate-900 p-4 flex flex-row gap-4">
                                <div className="h-full aspect-square border border-slate-900 border-dashed">
                                    <label htmlFor="featureImage" className="h-full flex justify-center items-center">{featureImage ? <img src={URL.createObjectURL(featureImage)} /> : "+"}</label>
                                    <input type="file" id="featureImage" className="hidden" onChange={(e) => { setFeatureImage(e.target.files?.[0]) }} />
                                </div>
                                <div className="w-full flex flex-col gap-4">
                                    <div className="w-full text-lg">
                                        <input value={features.title} onChange={(e) => { setFeatures({ ...features, title: e.target.value }) }} type="text" placeholder="Enter title" className="w-full outline-none" />
                                    </div>
                                    <div className="flex-1 h-full w-full text-sm text-gray-500">
                                        <textarea value={features.content} onChange={(e) => { setFeatures({ ...features, content: e.target.value }) }} placeholder="enter content" className="w-full h-full outline-none resize-none"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full ">
                                <button className="w-full h-12 uppercase bg-slate-900 text-white" onClick={() => { sendFeatures() }}>
                                    upload
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    </>
}

const FeatureMap = ({ product }: { product: any }) => {
    return <>

        <div className="w-full h-64 p-4 flex flex-row gap-4">
            <div className="h-full aspect-square flex justify-center items-center">
                <img src={`http://localhost:8080/${product.image.imageUrl}`} className="w-full" />
            </div>
            <div className="flex-col flex w-full gap-4">
                <div className="w-full text-lg">
                    {product.headline}
                </div>
                <div className="flex-1 h-full w-full text-sm text-gray-500">
                    {product.description}
                </div>
            </div>
        </div>

    </>
}