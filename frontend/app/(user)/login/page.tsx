import { LoginPage } from "@/app/Components/client/client";
import Link from "next/link";

export default function Page() {
    return <>

        <div className="flex justify-center items-center w-full h-full">
            <div className="w-1/3 p-4 bg-white shadow-sm rounded">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="text-2xl text-gray-600 font-medium">
                            Login
                        </div>
                        <div className="text-sm text-gray-800 opacity-75">
                            for best experience at desires
                        </div>
                    </div>
                    <LoginPage />
                </div>
            </div>
        </div >

    </>
}