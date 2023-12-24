import { OrdersList } from "@/app/Components/client/client";

export default function Page() {

    return <>

        <div className="w-full h-full pb-4 pr-4">
            <div className="w-full h-full bg-white p-4 shadow-sm rounded">
                <div className="w-full h-full flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="text-3xl text-gray-700 font-medium">
                            Orders
                        </div>
                        <div className="text-sm text-gray-500">
                            View your order status
                        </div>
                    </div>
                    <div className="w-full h-full">
                        <OrdersList />
                    </div>
                </div>
            </div>
        </div>

    </>
}
