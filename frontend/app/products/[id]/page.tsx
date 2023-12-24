import { AddToCartAndBuyNow, AddToWishlist, ReviewPortion } from "@/app/Components/client/client"
import { FeaturesCard } from "@/app/Components/server/server"
import { starSVG } from "@/app/icons/icons"
import { redirect } from "next/navigation"

export default async function Page({ params }: { params: { id: string } }) {

    const product = await getProduct(params.id)

    if (!product) {
        redirect("/")
    }

    return <div className="w-full h-full pb-4 px-4">
        <div className="w-full h-full bg-white shadow-sm rounded p-4 flex flex-col gap-8 overflow-y-scroll relative">
            <AddToWishlist id={params.id} />
            <div className="w-full h-full flex flex-row gap-4">
                <div className="flex-1 w-full h-full p-4">
                    <div className="w-full flex flex-col gap-2 ">
                        <div className="overflow-hidden shadow rounded w-full aspect-square bg-white flex justify-center items-center">
                            <img className="w-full" src={`http://localhost:8080/${params.id}/${product.mainImage.imageName}`} alt="" />
                        </div>
                        <div className="w-full flex flex-row gap-2">
                            <div className="overflow-hidden shadow rounded flex-1 w-full aspect-square bg-white flex justify-center items-center">
                                <img className="w-full" src={`http://localhost:8080/${params.id}/${product.images.image1.imageName}`} alt="" />
                            </div>
                            <div className="overflow-hidden shadow rounded flex-1 w-full aspect-square bg-white flex justify-center items-center">
                                <img className="w-full" src={`http://localhost:8080/${params.id}/${product.images.image2.imageName}`} alt="" />
                            </div>
                            <div className="overflow-hidden shadow rounded flex-1 w-full aspect-square bg-white flex justify-center items-center">
                                <img className="w-full" src={`http://localhost:8080/${params.id}/${product.images.image3.imageName}`} alt="" />
                            </div>
                            <div className="overflow-hidden shadow rounded flex-1 w-full aspect-square bg-white flex justify-center items-center">
                                <img className="w-full" src={`http://localhost:8080/${params.id}/${product.images.image4.imageName}`} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-[2] w-full h-full p-4">
                    <div className="w-full h-full flex flex-col gap-3">
                        <div className="text-3xl font-medium text-gray-700">
                            {product.name}
                        </div>
                        <div className="text-lg font-normal text-gray-700">
                            {product.subtitle}
                        </div>
                        <div className="flex flex-row w-full text-2xl font-light text-gray-600">
                            <span>
                                $ {product.price}
                            </span>
                        </div>
                        <div className="text-md font-light text-gray-700">
                            Hurry only {product.stock} left
                        </div>
                        <div>
                            <div className="bg-red-100 text-red-600 px-2 py-2 rounded flex justify-center text-md flex-row gap-2 w-fit items-center fill-red-600">
                                <span className="flex justify-center text-lg items-center">
                                    {product.rating}
                                </span>
                                <span className="h-fit w-fit scale-95">
                                    {starSVG}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-2xl font-medium text-gray-500">
                                Highlights
                            </div>
                            <div className="flex flex-col gap-2">
                                {product.highlights.map((e: string) => { return <li className=" list-disc  text-sm ">{e}</li> })}
                            </div>
                        </div>
                        <div className="flex-1 w-full h-full">

                        </div>
                        <AddToCartAndBuyNow id={params.id} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-5 w-full">
                <div>
                    <div className="flex justify-center items-center text-2xl font-gray-500 font-medium">
                        Features
                    </div>
                </div>
                <div className="w-full border border-slate-300 p-4">
                    <div className="w-full flex flex-col gap-4">
                        {
                            product.features.map((e: any, index: number) => <FeaturesCard rev={index % 2 == 0} img={`http://localhost:8080/${params.id}/features/${e.image.imageName}`} title={e.headline} content={e.description} />)
                        }
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-5 w-full">
                <div>
                    <div className="flex justify-center items-center text-2xl font-gray-500 font-medium">
                        Reviews
                    </div>
                </div>
                <div>
                    <ReviewPortion productId={params.id} />
                </div>
            </div>
        </div>
    </div>
}

const getProduct = async (id: string) => {

    const response = await fetch(`http://localhost:8080/api/product/${id}`, {
        cache: "no-cache"
    })
    const res = await response.json()
    if (res.success) {
        return res.product
    }
    return undefined

}
