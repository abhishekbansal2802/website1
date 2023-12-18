import { starSVG } from "@/app/icons/icons"
import Link from "next/link"

export const NavigationItems = ({ text, icon, link }: { text: string, icon: JSX.Element, link: string }) => {
    return <Link href={link}>
        <div className="flex flex-row gap-3 items-center">
            <span className="scale-75 ">
                {icon}
            </span>
            <span>
                {text}
            </span>
        </div>
    </Link>
}

export const ProductCardClient = ({ product }: { product: any }) => {
    return <Link className="w-1/5 p-4 h-min bg-gray-50 rounded shadow-sm flex flex-col gap-4 flex-shrink-0" href={`products/${product._id}`}>
        <div className="w-full">

            <div className="w-full flex justify-center items-center aspect-square bg-white rounded">
                <img src={`http://localhost:8080/${product._id}/${product.mainImage.imageName}`} alt="" />
            </div>
            <div className="w-full h-16 flex flex-col gap-2">
                <div className="text-xl font-medium text-gray-700 line-clamp-1 w-full text-ellipsis">
                    {product.name}
                </div>
                <div className="flex-1 text-md text-gray-500 flex flex-row justify-between items-center">
                    <div className="">
                        $ {product.price}
                    </div>
                    <div className="flex gap-2 items-center" >
                        <span className="scale-75">
                            {starSVG}
                        </span> {product.rating}
                    </div>
                </div>
            </div>

        </div>
    </Link>
}

export const FeaturesCard = ({ img, title, content, rev }: { img: string, title: string, content: string, rev: boolean }) => {
    return <>

        <div className={`flex gap-2 w-full h-64 ${rev ? "flex-row" : "flex-row-reverse"}`}>
            <div className="h-full aspect-square shadow rounded flex justify-center items-center" >
                <img src={img} />
            </div>
            <div className="flex flex-1 flex-col gap-2">
                <div className="text-lg text-gray-700 font-medium">
                    {title}
                </div>
                <div className="text-md text-gray-500 font-light">
                    {content}
                </div>
            </div>
        </div>

    </>
}