"use client"

import { DownArrowSVG, RightArrowSVG, UpArrowSVG, closeSVG, logoutSVG } from "@/app/icons/icons"
import { useGenerationState } from "@/app/states/state"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from 'framer-motion'

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

    const [showUpdatePassword, setShowUpdatePassword] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false)

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
        <div className="">
            <button onClick={() => { setShowUpdatePassword(!showUpdatePassword) }} className="flex-row flex gap-3 items-center w-fit text-xl rounded-full hover:bg-gray-100 duration-100 transition-all px-3 py-2 text-gray-700 font-normal ">
                Update Password {RightArrowSVG}
            </button>
        </div >
        <div className="">
            <Link href="/address" className="flex-row flex gap-3 items-center w-fit text-xl rounded-full hover:bg-gray-100 duration-100 transition-all px-3 py-2 text-gray-700 font-normal ">
                View Address {RightArrowSVG}
            </Link>
        </div >

        {showUpdatePassword ? <UpdatePasswordDialog close={() => { setShowUpdatePassword(false) }} dialog={() => { setShowDialog(true) }} /> : null}
        {showDialog ? <AlertDialog close={() => { setShowDialog(false) }} sliderColor="bg-green-600" textColor="text-green-600" title="Password Changed" content="Account password successfully changed" color="bg-green-100" /> : null}
    </>
}

interface UpdatePasswordFields {
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string
}

const UpdatePasswordDialog = ({ close, dialog }: { close: () => void, dialog: () => void }) => {

    const [inputFields, setInputFields] = useState<UpdatePasswordFields>({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    })

    const updatePasswordHandler = async () => {
        if (inputFields.newPassword == "" || inputFields.oldPassword == "" || inputFields.confirmNewPassword == "") return

        if (inputFields.newPassword != inputFields.confirmNewPassword) return

        const response = await fetch(
            `http://localhost:8080/api/user/change/password/${localStorage.getItem("token")}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        password: inputFields.oldPassword,
                        newPassword: inputFields.newPassword,
                        confNewPassword: inputFields.confirmNewPassword,
                    }
                )
            }
        )
        const res = await response.json()
        if (res.success) {
            close()
            dialog()
        } else {
            setErrorMessage(res.message)
            setShowDialog(true)
        }

    }


    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("");

    return <>

        <div className="w-screen h-screen bg-black bg-opacity-60 absolute top-0 left-0 z-40">
            <div className="w-full h-full flex justify-center items-center">
                <div className="w-1/3 bg-white rounded p-4">
                    <div className="flex flex-col gap-3 relative">
                        <div className="absolute top-0 right-0">
                            <button onClick={() => { close() }}>{closeSVG}</button>
                        </div>
                        <div className="text-xl font-medium text-gray-700">
                            Change Password
                        </div>
                        <div>
                            <div className="flex flex-col gap-3 w-full">
                                <div className="w-full flex flex-col gap-1">
                                    <label htmlFor="oldPassword" className="text-sm text-gray-500">old password</label>
                                    <input value={inputFields.oldPassword} onChange={(e) => setInputFields({ ...inputFields, oldPassword: e.target.value })} type="password" id="oldPassword" className="w-full h-12 bg-gray-50 outline-none border border-slate-300 px-2 py-2" />
                                </div>
                                <div className="w-full flex flex-col gap-1">
                                    <label htmlFor="newPassword" className="text-sm text-gray-500">New password</label>
                                    <input value={inputFields.newPassword} onChange={(e) => setInputFields({ ...inputFields, newPassword: e.target.value })} type="password" id="newPassword" className="w-full h-12 bg-gray-50 outline-none border border-slate-300 px-2 py-2" />
                                </div>
                                <div className="w-full flex flex-col gap-1">
                                    <label htmlFor="confNewPass" className="text-sm text-gray-500">Confirm new password</label>
                                    <input value={inputFields.confirmNewPassword} onChange={(e) => setInputFields({ ...inputFields, confirmNewPassword: e.target.value })} type="password" id="confNewPass" className="w-full h-12 bg-gray-50 outline-none border border-slate-300 px-2 py-2" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <button onClick={() => { updatePasswordHandler() }} className="uppercase w-full h-12 bg-slate-900 text-white">update</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {showDialog ? <AlertDialog close={() => { setShowDialog(false) }} title="Something went wrong" content={errorMessage} color="bg-red-100" textColor={"text-red-600"} sliderColor="bg-red-600" /> : null}

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

export const AlertDialog = ({ close, title, content, color, textColor, sliderColor }: { close: () => void, title: string, content: string, color: string, textColor: string, sliderColor: string }) => {

    useEffect(() => {
        setTimeout(() => {
            close()
        }, 2000)
    }, [])

    const handleClose = () => {
        close()
    }

    return <>

        <div className={`${color} w-1/3 rounded shadow absolute top-10 right-10 overflow-hidden`}>
            <div className="relative w-full h-full">
                <button className="absolute top-4 right-4" onClick={() => { handleClose() }}>{closeSVG}</button>
                <div className="pt-4 pb-4 pl-4 pr-16">
                    <div className={`${textColor} text-lg font-medium`}>
                        {title}
                    </div>
                    <div className={`${textColor} text-sm font-light`}>
                        {content}
                    </div>
                </div>
                <motion.div
                    className={`absolute bottom-0 left-0 h-1 w-full ${sliderColor}`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                ></motion.div>
            </div>
        </div >

    </>
}