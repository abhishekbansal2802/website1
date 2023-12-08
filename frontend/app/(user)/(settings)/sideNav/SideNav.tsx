import { LogoutButton } from "@/app/Components/client/client"
import { UserSVG, addressSVG, logoutSVG, ordersSVG, wishlistSVG } from "@/app/icons/icons"
import Link from "next/link"

export default function SideNav() {

    return <>

        <div className="w-72 h-full pb-4 px-4">
            <div className="w-full h-full bg-white rounded shadow p-4">
                <div className="flex h-full flex-col">
                    <div className="flex h-full flex-col gap-10">
                        {
                            NavigationPanelItems.map((e) => <NavigationItems text={e.text} icon={e.icon} link={e.link} />)
                        }
                    </div>
                    <div className="flex-1 h-full w-full">
                    </div>
                    <div>
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </div>

    </>

}

interface NavigationPanelItem {
    icon: JSX.Element,
    text: string,
    link: string
}

const NavigationPanelItems: Array<NavigationPanelItem> = [
    {
        icon: UserSVG,
        text: "Profile",
        link: "/profile",
    },
    {
        icon: addressSVG,
        text: "Address",
        link: "/address",
    },
    {
        icon: wishlistSVG,
        text: "Wishlist",
        link: "/wishlist",
    },
    {
        icon: ordersSVG,
        text: "Orders",
        link: "/orders",
    },
]

const NavigationItems = ({ text, icon, link }: { text: string, icon: JSX.Element, link: string }) => {
    return <Link href={link}>
        <div className="flex flex-row gap-3 items-center">
            <span className="scale-75 fill-gray-400">
                {icon}
            </span>
            <span>
                {text}
            </span>
        </div>
    </Link>
}