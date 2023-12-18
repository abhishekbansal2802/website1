import { HeaderForExplore } from "../Components/client/client"
import { ProductCardClient } from "../Components/server/server"

export default async function Page() {

    const products = await getProducts()

    const trendingPrducts = await getTrendingProducts()

    const mobileProducts = await getMobileProducts()

    const furnitureProducts = await getFurnitureProducts()

    const applianceProducts = await getApplianceProducts()


    return <>

        <div className="w-full h-full px-4 pb-4">
            <div className="w-full h-full p-4 bg-white shadow-sm rounded">
                <div className="flex flex-col gap-10 ">
                    <HeaderForExplore ></HeaderForExplore>
                    <div>
                        <div className="text-2xl font-medium text-gray-700">
                            Trending Today,
                        </div>
                        <div className="text-sm font-light text-gray-500">
                            Shop with todays trend,
                        </div>
                        <div className="w-full overflow-x-scroll">
                            <div className="flex flex-row gap-6 flex-nowrap">
                                {trendingPrducts.map((e) => <ProductCardClient product={e} />)}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="text-2xl font-medium text-gray-700">
                            Recommended for you,
                        </div>
                        <div className="text-sm font-light text-gray-500">
                            based on past interests,
                        </div>

                        <div className="w-full overflow-x-scroll">
                            <div className="flex flex-row gap-6 flex-nowrap">
                                {products.map((e) => <ProductCardClient product={e} />)}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="text-2xl font-medium text-gray-700">
                            Mobile Phones,
                        </div>
                        <div className="text-sm font-light text-gray-500">
                            our top mobile picks for you,
                        </div>

                        <div className="w-full overflow-x-scroll">
                            <div className="flex flex-row gap-6 flex-nowrap">
                                {mobileProducts.map((e) => <ProductCardClient product={e} />)}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="text-2xl font-medium text-gray-700">
                            Furniture,
                        </div>
                        <div className="text-sm font-light text-gray-500">
                            what suits your home,
                        </div>
                        <div className="w-full overflow-x-scroll">
                            <div className="flex flex-row gap-6 flex-nowrap">
                                {furnitureProducts.map((e) => <ProductCardClient product={e} />)}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="text-2xl font-medium text-gray-700">
                            Electronics,
                        </div>
                        <div className="text-sm font-light text-gray-500">
                            we will help you find most apt appliances,
                        </div>
                        <div className="w-full overflow-x-scroll">
                            <div className="flex flex-row gap-6 flex-nowrap">
                                {applianceProducts.map((e) => <ProductCardClient product={e} />)}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </>
}

const getProducts = async () => {
    const response = await fetch("http://localhost:8080/api/product", { cache: "no-cache" })
    const res = await response.json()
    if (res.success) {
        return res.products as Array<any>
    }
    return []
}

const getTrendingProducts = async () => {
    const response = await fetch("http://localhost:8080/api/analytics/trending", { cache: "no-cache" })
    const res = await response.json()
    if (res.success) {
        return res.products as Array<any>
    }
    return []
}

const getMobileProducts = async () => {
    const response = await fetch("http://localhost:8080/api/analytics/mobile", { cache: "no-cache" })
    const res = await response.json()
    if (res.success) {
        return res.products as Array<any>
    }
    return []
}
const getFurnitureProducts = async () => {
    const response = await fetch("http://localhost:8080/api/analytics/furniture", { cache: "no-cache" })
    const res = await response.json()
    if (res.success) {
        return res.products as Array<any>
    }
    return []
}
const getApplianceProducts = async () => {
    const response = await fetch("http://localhost:8080/api/analytics/appliance", { cache: "no-cache" })
    const res = await response.json()
    if (res.success) {
        return res.products as Array<any>
    }
    return []
}