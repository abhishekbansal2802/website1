import { BecomeAClient } from "@/app/Components/client/client";
import { RightArrowSVG } from "@/app/icons/icons";

export default function Page() {
    return <>

        <div className="w-full h-full pr-4 pb-4">
            <div className="w-full h-full bg-white shadow-sm rounded p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="text-3xl text-gray-700 font-medium">
                            Become A Seller
                        </div>
                        <div className="text-sm text-gray-500" >
                            Sell with us and get a greater reach
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-medium">
                            Benefits of being a seller with us
                        </div>
                        <div className="h-6">

                        </div>
                        <div>
                            <ul className="list-disc px-4 flex flex-col gap-3 text-md text-gray-700">
                                <li>
                                    Get Greater Reach by delivering whole India
                                </li>
                                <li>
                                    Easy management of inventory
                                </li>
                                <li>
                                    Pay Less Commission
                                </li>
                                <li>
                                    Easy Product Add and Delete
                                </li>
                            </ul>
                        </div>
                    </div>
                    <BecomeAClient />
                </div>
            </div>
        </div >

    </>
}