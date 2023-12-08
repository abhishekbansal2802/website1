"use client"

import { DownArrowSVG, UpArrowSVG, logoutSVG } from "@/app/icons/icons"
import { useGenerationState } from "@/app/states/state"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


export const DropdownForMore = () => {

    const [expanded, setExpanded] = useState(false)

    const { loggedIn, setLoggedIn, setUser } = useGenerationState();

    const logoutHandler = () => {
        localStorage.removeItem("token")
        setLoggedIn(false)
        setUser(undefined);
    }

    useEffect(() => {

        if (localStorage.getItem("token")) {
            setLoggedIn(true)
            getUser()
        }

    }, [])

    const getUser = async () => {
        const response = await fetch(
            `http://localhost:8080/api/user/me/${localStorage.getItem("token")}`,
        )
        if (response.ok) {
            const res = await response.json()
            if (res.success) {
                setUser(
                    {
                        name: res.user.name,
                        email: res.user.email,
                        contact: res.user.contactNumber
                    }
                )
            }
        }
    }

    return <>
        {
            loggedIn ?
                <div className="relative">
                    <button className="flex flex-row gap-1" onClick={() => { setExpanded(!expanded) }}>More <span className="scale-75">{expanded ? UpArrowSVG : DownArrowSVG}</span></button>
                    {expanded &&
                        <div className="absolute -bottom-2 w-48 p-2 -translate-x-1/4 translate-y-full bg-white shadow rounded">
                            <div className="flex gap-1 flex-col">
                                <button className="w-full text-md text-left p-2 hover:bg-gray-100 rounded"><Link href="/profile">profile</Link></button>
                                <button className="w-full text-md text-left p-2 hover:bg-gray-100 rounded">orders</button>
                                <button className="w-full text-md text-left p-2 hover:bg-gray-100 rounded">wishlist</button>
                                <div className="w-full h-[1px] bg-gray-100 rounded"></div>
                                <button className="w-full text-md text-left p-2 hover:bg-red-100 rounded text-red-600" onClick={() => { logoutHandler() }}>Logout</button>
                            </div>
                        </div>
                    }
                </div> : <Link href="/login">Login</Link>
        }

    </>

}

export const ProfilePage = () => {

    const { user } = useGenerationState()

    return <>
        <div>
            <div className="text-2xl text-gray-700 font-normal">
                Name
            </div>
            <div className="text-md text-gray-600">
                {user?.name}
            </div>
        </div>
        <div>
            <div className="text-2xl text-gray-700 font-normal">
                Email
            </div>
            <div className="text-md text-gray-600">
                {user?.email}
            </div>
        </div>
        <div>
            <div className="text-2xl text-gray-700 font-normal">
                Contact Number
            </div>
            <div className="text-md text-gray-600">
                {user?.contact}
            </div>
        </div>
        <div>
            <div className="text-2xl text-gray-700 font-normal">
                Change Password
            </div>
            <div className="text-md text-gray-600">
                {user?.contact}
            </div>
        </div>
    </>
}

export const LogoutButton = () => {

    const { setUser, setLoggedIn } = useGenerationState()

    const router = useRouter()

    const onClick = () => {
        setLoggedIn(false)
        setUser(undefined)
        localStorage.removeItem("token")
        router.replace("/")
    }

    return <>

        <button onClick={() => { onClick() }}>
            <div className="flex flex-row gap-3 items-center">
                <span className="scale-75">
                    {logoutSVG}
                </span>
                <span>
                    Logout
                </span>
            </div>
        </button>
    </>
}

interface LoginDetails {
    email: string,
    password: string
}

export const LoginPage = () => {

    const router = useRouter()

    const { setUser, setLoggedIn } = useGenerationState()

    const [loginDetails, setLoginDetails] = useState<LoginDetails>({
        email: "",
        password: ""
    })

    const loginHandler = async () => {
        if (loginDetails.email == "" || loginDetails.password == "") return
        const response = await fetch(
            "http://localhost:8080/api/user/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        email: loginDetails.email,
                        password: loginDetails.password,
                    }
                )
            }
        )
        if (response.ok) {
            const res = await response.json()
            if (res.success) {
                localStorage.setItem("token", res.token)
                setLoggedIn(true)
                getUser(res.token)
                router.replace("/")
            } else {

            }
        }
    }

    const getUser = async (token: string) => {
        const response = await fetch(`http://localhost:8080/api/user/me/${token}`)
        if (response.ok) {
            const res = await response.json()
            if (res.success) {
                setUser(
                    {
                        name: res.user.name,
                        email: res.user.email,
                        contact: res.user.contactNumber
                    }
                )
            }
        }
    }

    return <>
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <label htmlFor="email" className=" text-sm text-gray-500">Email</label>
                <input value={loginDetails.email} onChange={(e) => { setLoginDetails({ email: e.target.value, password: loginDetails.password }) }} type="email" id="email" className="w-full h-12 bg-gray-50 border-slate-300 border outline-none px-2 py-1" />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="password" className=" text-sm text-gray-500">Password</label>
                <input value={loginDetails.password} onChange={(e) => { setLoginDetails({ password: e.target.value, email: loginDetails.email }) }} type="password" id="password" className="w-full h-12 bg-gray-50 border-slate-300 border outline-none px-2 py-1" />
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <button onClick={() => { loginHandler() }} className="uppercase w-full h-12 bg-slate-900 text-white">Login</button>
            <p className="text-sm w-full text-gray-500 flex justify-center">OR</p>
            <Link className="text-sm w-full flex justify-center" href="/register">New user? register here</Link>
        </div>

    </>
}

interface RegisterDetails {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    contactNumber: string
}

export const RegisterPage = () => {

    const router = useRouter()

    const [registerDetails, setRegisterDetails] = useState<RegisterDetails>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        contactNumber: ""
    })

    const registerHandler = async () => {
        if (registerDetails.firstName == "" || registerDetails.lastName == "" || registerDetails.email == "" || registerDetails.password == "" || registerDetails.contactNumber == "") return
        console.log('new world')
        const response = await fetch(
            "http://localhost:8080/api/user/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        name: registerDetails.firstName + " " + registerDetails.lastName,
                        email: registerDetails.email,
                        password: registerDetails.password,
                        contactNumber: registerDetails.contactNumber,
                    }
                )
            }
        )
        if (response.ok) {
            const res = await response.json()
            console.log(res)
            if (res.success) {
                router.replace("/")
                localStorage.setItem("token", res.token)
            } else {

            }
        }
    }

    return <>

        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <div className="flex-1 flex flex-col gap-1">
                    <label className="text-sm text-gray-500" htmlFor="firstName">First Name</label>
                    <input type="text" value={registerDetails.firstName} onChange={(e) => { setRegisterDetails({ firstName: e.target.value, email: registerDetails.email, lastName: registerDetails.lastName, password: registerDetails.password, contactNumber: registerDetails.contactNumber }) }} id="firstName" className="w-full h-12 bg-gray-50 border px-2 py-2 border-slate-300 outline-none" />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                    <label htmlFor="lastName" className="text-sm text-gray-500">Last Name</label>
                    <input type="text" value={registerDetails.lastName} onChange={(e) => { setRegisterDetails({ lastName: e.target.value, email: registerDetails.email, firstName: registerDetails.firstName, password: registerDetails.password, contactNumber: registerDetails.contactNumber }) }} id="lastName" className="w-full h-12 bg-gray-50 border px-2 py-2 border-slate-300 outline-none" />
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm text-gray-500">Email</label>
                <input type="email" value={registerDetails.email} onChange={(e) => { setRegisterDetails({ email: e.target.value, firstName: registerDetails.firstName, lastName: registerDetails.lastName, password: registerDetails.password, contactNumber: registerDetails.contactNumber }) }} id="email" className="w-full h-12 bg-gray-50 px-2 py-2 border border-slate-300 outline-none" />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm text-gray-500">Password</label>
                <input type="password" value={registerDetails.password} onChange={(e) => { setRegisterDetails({ password: e.target.value, email: registerDetails.email, lastName: registerDetails.lastName, firstName: registerDetails.firstName, contactNumber: registerDetails.contactNumber }) }} id="password" className="w-full h-12 bg-gray-50 px-2 py-2 border border-slate-300 outline-none" />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="contact" className="text-sm text-gray-500">Phone Number</label>
                <input type="tel" value={registerDetails.contactNumber} onChange={(e) => { setRegisterDetails({ contactNumber: e.target.value, email: registerDetails.email, lastName: registerDetails.lastName, password: registerDetails.password, firstName: registerDetails.firstName }) }} id="contact" className="w-full h-12 bg-gray-50 px-2 py-2 border border-slate-300 outline-none" />
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <button onClick={() => { registerHandler() }} className="uppercase text-white bg-slate-900 w-full h-12">Register</button>
            <p className="text-sm text-gray-500 flex justify-center">
                OR
            </p>
            <Link className="text-sm flex justify-center" href="/login">Already a user? Login</Link>
        </div></>
}