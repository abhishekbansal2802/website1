import { Wishlist } from "@/app/Components/client/client";

export default function Page() {
    return <>
        <div className="w-full h-full pb-4 pr-4">
            <div className="w-full h-full bg-white shadow-sm rounded p-4">
                <div className="w-full h-full flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="text-3xl font-medium text-gray-700">
                            Wishlist
                        </div>
                        <div className="text-sm text-gray-500">
                            product that you desire
                        </div>
                    </div>
                    <Wishlist />
                </div>
            </div> 
        </div>
    </>
}