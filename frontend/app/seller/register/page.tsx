import { SellerRegister } from "@/app/Components/client/client";

export default function Page() {
    return <>

        <div className="w-full h-full flex justify-center items-center">

            <div className="w-1/3 p-4 bg-white shadow-sm rounded">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="text-2xl font-medium text-gray-700">
                            Become a seller
                        </div>
                        <div className="text-sm text-gray-500 font-light">
                            Register as a seller and be a part of desires
                        </div>
                    </div>

                    <SellerRegister />
                </div>
            </div>

        </div>


    </>
}