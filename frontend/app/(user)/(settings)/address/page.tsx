import { AddressList } from "@/app/Components/client/client";

export default function Page() {
    return <>

        <div className="w-full h-full  pr-4 pb-4">
            <div className=" w-full h-full bg-white rounded shadow-sm p-4">
                <div className="flex flex-col gap-6 w-full h-full">
                    <div className="flex flex-col gap-2">
                        <div className="text-3xl font-medium text-gray-700">
                            My Address
                        </div>
                        <div className="text-sm text-gray-500">
                            Where we will deliver
                        </div>
                    </div>
                    <div className="flex-1 w-full h-full">
                        <AddressList />
                    </div>
                </div>
            </div>
        </div>

    </>
}