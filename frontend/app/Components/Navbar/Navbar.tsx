import { DownArrowSVG } from "@/app/icons/icons";
import Link from "next/link";
import { DropdownForMore } from "../client/client";

export default function Navbar() {
    return <>

        <div className="w-full h-24 p-4">
            <div className="w-full h-full bg-white rounded shadow-sm">
                <div className="flex flex-row w-full h-full">
                    <div className="flex-1 w-full h-full px-4 items-center flex text-xl font-medium text-gray-600 cursor-pointer">
                        <Link href="/">Desires</Link>
                    </div>
                    <div className="flex-1 w-full h-full">

                    </div>
                    <div className="flex-1 w-full h-full px-4">
                        <ul className="flex flex-row items-center justify-between h-full w-full">
                            <li className="cursor-pointer">Product</li>
                            <li className="cursor-pointer"><DropdownForMore /></li>
                            <li className="cursor-pointer">Contact</li>
                            <li className="cursor-pointer">About</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    </>
}