import { LogoutButton, OptionalSideNav } from "@/app/Components/client/client"
import { NavigationItems } from "@/app/Components/server/server"
import { UserSVG, addressSVG, cartSVG, logoutSVG, ordersSVG, sellerTagSVG, wishlistSVG } from "@/app/icons/icons"
import Link from "next/link"

export default function SideNav() {

    return <>

        <div className="w-72 h-full pb-4 px-4">
            <div className="w-full h-full bg-white rounded shadow-sm p-4">
                <div className="flex h-full flex-col">
                    <div className="flex h-full flex-col gap-10">
                        {
                            NavigationPanelItems.map((e) => <NavigationItems text={e.text} icon={e.icon} link={e.link} />)
                        }
                        <OptionalSideNav />
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
    {
        icon: cartSVG,
        text: "cart",
        link: '/cart'
    }
]

