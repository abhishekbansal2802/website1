import { AddProduct, DelistedProducts, ListedProducts } from "@/app/Components/client/client";

export default function Page() {
    return <>
        <div className="w-full pr-4 pb-4 h-full">
            <div className="w-full h-full bg-white shadow-sm rounded p-4 flex flex-col gap-6" >
                <div className="flex flex-col gap-2">
                    <div className="text-3xl font-medium text-gray-700">
                        Products
                    </div>
                    <div className="text-sm text-gray-500">
                        Your products to manage
                    </div>
                </div>
                <div>
                    <div className="text-2xl font-normal text-gray-700">
                        Listed Products
                    </div>
                    <div>
                        <ListedProducts />
                    </div>
                </div>
                <div className="w-full">
                    <div className="text-2xl font-normal text-gray-700">
                        Delisted Products
                    </div>
                    <div className="w-full">
                        <DelistedProducts />
                    </div>
                </div>
                <div>
                    <div className="text-2xl font-normal text-gray-700">
                        Products with stock less than 10
                    </div>
                </div>
            </div>

            <AddProduct />

        </div>
    </>
}