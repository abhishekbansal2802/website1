import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-full px-4 pb-4">
      <div className="w-full h-full bg-white shadow-sm rounded p-4">
        <div className="w-full h-full flex justify-center items-center flex-col gap-10">
          <div className="flex flex-col gap-2">
            <div className="text-6xl font-semibold text-gray-700">
              Welcome To Desires
            </div>
            <div className="w-full m-auto text-center text-sm font-light text-gray-500">
              Place to buy what you desire
            </div>
          </div>
          <div>
            <Link href="/explore" className="bg-slate-900 text-white px-6 py-2 rounded-full">
              Explore 👀
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
