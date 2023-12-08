import SideNav from "./sideNav/SideNav"

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="w-full h-full flex flex-row">
            <div>
                <SideNav></SideNav>
            </div>
            <div className="flex-1">
                {children}
            </div>
        </div>
    )
}
