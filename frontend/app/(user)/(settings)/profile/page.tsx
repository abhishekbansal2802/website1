import { ProfilePage } from "@/app/Components/client/client";


export default function Page() {

    return <>

        <div className="w-full h-full pb-4 pr-4">
            <div className="w-full bg-white h-full shadow rounded p-4">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="text-3xl font-medium text-gray-700">
                            Profile
                        </div>
                        <div className="text-sm text-gray-500">
                            What we know about you!
                        </div>
                    </div>
                    <ProfilePage />

                </div>
            </div>
        </div>


    </>
}