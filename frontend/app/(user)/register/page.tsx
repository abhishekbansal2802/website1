import { RegisterPage } from "@/app/Components/client/client";
import Link from "next/link";

export default function Page() {
    return <>

        <div className="w-full h-full flex justify-center items-center">

            <div className="w-1/3 p-4 bg-white shadow-sm rounded">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="text-2xl font-medium text-gray-600">
                            Register
                        </div>
                        <div className="text-sm text-gray-800 opacity-75">
                            to start your journey with desires
                        </div>
                    </div>
                    <RegisterPage />
                </div>
            </div>

        </div>

    </>

}