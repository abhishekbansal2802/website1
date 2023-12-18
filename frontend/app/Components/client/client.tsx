"use client"

import { DownArrowSVG, RightArrowSVG, UpArrowSVG, closeSVG, deleteSVG, doneTagSVG, editTagSVG, heartFillSVG, heartSVG, homeTagSVG, logoutSVG, orderBookTagSVG, otherTagSVG, plusSVG, productsTagSVG, sellerTagSVG, starSVG, verifiedTag, workTagSVG } from "@/app/icons/icons"
import { useGenerationState } from "@/app/states/state"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from 'framer-motion'
import { NavigationItems, ProductCardClient } from "../server/server"

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
                        contact: res.user.contactNumber,
                        userType: res.user.userType,
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
                        contact: res.user.contactNumber,
                        userType: res.user.userType,
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

interface Address {
    flatNo: string,
    society: string,
    street: string,
    city: string,
    state: string,
    pincode: string,
    landmark: string,
    tag: string
}

interface ResponseAddress {
    _id: string
    flatNo: string,
    society: string,
    street: string,
    city: string,
    state: string,
    pincode: string,
    landmark: string,
    tag: string
}

export const AddressList = () => {

    const [showAddAddress, setShowAddress] = useState<boolean>(false);

    const [address, setAddress] = useState<Array<ResponseAddress>>([]);

    const getAddress = async () => {
        const response = await fetch(
            `http://localhost:8080/api/address/${localStorage.getItem("token")}`
        )
        const res = await response.json()
        if (res.success) {
            setAddress([...res.address])
        }
    }

    const [showDialog, setShowDialog] = useState<boolean>(false)

    useEffect(() => {
        getAddress()
    }, [])


    return <>

        <div className="w-1/2">
            <div className="flex flex-col gap-5">
                {address.map((e) => <AddressCard address={e} appendAddress={() => { getAddress() }} />)}
            </div>
        </div>

        {address.length == 0 ? <>
            <div className="w-full h-full flex justify-center items-center text-sm text-gray-500 font-light">
                No addresses added start adding by clicking plus icon
            </div>
        </> : null
        }

        <button onClick={() => { setShowAddress(true) }} className="absolute bottom-8 right-8 z-50 w-14 h-14 bg-slate-900 shadow cursor-pointer rounded-full flex justify-center items-center">
            {plusSVG}
        </button>

        {
            showAddAddress ? <AddAddress showDialog={() => { setShowDialog(true) }} appendAddress={getAddress} close={() => { setShowAddress(false) }} /> : null
        }

        {
            showDialog ? <AlertDialog close={() => { setShowDialog(false) }} title="Address Added" content="Address entered was added" color="bg-green-100" textColor="text-green-600" sliderColor="bg-green-600" /> : null
        }

    </>

}

const AddressCard = ({ address, appendAddress }: { address: ResponseAddress, appendAddress: () => void }) => {

    const svg = address.tag == "HOME" ? homeTagSVG : address.tag == "WORK" ? workTagSVG : otherTagSVG

    const removeAddressHandler = async () => {
        const response = await fetch(
            `http://localhost:8080/api/address/${localStorage.getItem("token")}/${address._id}`,
            {
                method: "DELETE"
            }
        )
        const res = await response.json()
        if (res.success) {
            appendAddress()
        }
    }

    return <>

        <div className="w-full bg-gray-50 shadow-sm rounded p-4">
            <div className="flex flex-col gap-3 text-sm relative">
                <div className="absolute top-0 right-0 scale-75" >
                    <button onClick={() => { removeAddressHandler() }}>
                        {closeSVG}
                    </button>
                </div>
                <div className="flex-row flex gap-1 items-center">
                    <span className="scale-75 fill-gray-700">
                        {svg}
                    </span>
                    <span className="text-sm text-gray-700">
                        {address.tag.toLowerCase()}
                    </span>
                </div>
                <div className="text-gray-800">
                    <div>
                        <span className="">
                            {address.flatNo}, {address.society}, {address.street}
                        </span>
                    </div>
                    <div>
                        <span>
                            {address.city}, {address.state}, {address.pincode}
                        </span>
                    </div>
                    <div>
                        <span>
                            near {address.landmark}
                        </span>
                    </div>
                </div>

            </div>
        </div>

    </>
}

export const AddAddress = ({ close, appendAddress, showDialog }: { close: () => void, appendAddress: () => void, showDialog: () => void }) => {

    const [address, setAddress] = useState<Address>(
        {
            flatNo: "",
            society: "",
            street: "",
            city: "",
            state: "",
            pincode: "",
            landmark: "",
            tag: ""
        }
    );

    const submitHandler = async () => {
        if (address.flatNo == "" || address.society == "" || address.city == "" || address.landmark == "" || address.pincode == "" || address.state == "" || address.street == "" || address.tag == "") return
        const response = await fetch(
            `http://localhost:8080/api/address/add/${localStorage.getItem('token')}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        flatNo: address.flatNo,
                        society: address.society,
                        street: address.street,
                        city: address.city,
                        state: address.state,
                        pincode: address.pincode,
                        landmark: address.landmark,
                        tag: address.tag
                    }
                )
            }
        )
        const res = await response.json()
        if (res.success) {
            close()
            appendAddress()
            showDialog()
        } else {

        }
    }

    return <>

        <div className="w-screen h-screen absolute top-0 left-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
            <div className="w-1/3 p-4 bg-white rounded ">
                <div className="w-full h-full relative flex flex-col gap-3">
                    <div className="absolute top-0 right-0">
                        <button onClick={() => { close() }}>
                            {closeSVG}
                        </button>
                    </div>
                    <div className="flex flex-col">
                        <div className="text-2xl font-medium text-gray-700 ">
                            Add Address
                        </div>
                        <div className="text-sm font-light text-gray-500">
                            Fill out the details below to add address
                        </div>
                    </div>
                    <div className="flex flex-row gap-2">
                        <div className="flex-1 flex flex-col gap-1">
                            <label htmlFor="flatno" className="text-sm text-gray-500">Flat No / House No</label>
                            <input type="text" value={address.flatNo} onChange={(e) => setAddress({ ...address, flatNo: e.target.value })} id="flatno" className="w-full h-12 bg-gray-50 border border-slate-300 px-2 py-2 outline-none" />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <label htmlFor="society" className="text-sm text-gray-500">society</label>
                            <input type="text" value={address.society} onChange={(e) => setAddress({ ...address, society: e.target.value })} id="society" className="w-full h-12 bg-gray-50 border border-slate-300 px-2 py-2 outline-none" />
                        </div>
                    </div>
                    <div className="flex flex-row gap-2">
                        <div className="flex-1 flex flex-col gap-1">
                            <label htmlFor="street" className="text-sm text-gray-500">street</label>
                            <input type="text" id="street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="w-full h-12 bg-gray-50 border border-slate-300 px-2 py-2 outline-none" />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <label htmlFor="city" className="text-sm text-gray-500">city</label>
                            <input type="text" id="city" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full h-12 bg-gray-50 border border-slate-300 px-2 py-2 outline-none" />
                        </div>
                    </div>
                    <div className="flex flex-row gap-2">
                        <div className="flex-1 flex flex-col gap-1">
                            <label htmlFor="state" className="text-sm text-gray-500">state</label>
                            <input type="tel" id="state" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="w-full h-12 bg-gray-50 border border-slate-300 px-2 py-2 outline-none" />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <label htmlFor="pincode" className="text-sm text-gray-500">pincode</label>
                            <input type="text" id="pincode" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="w-full h-12 bg-gray-50 border border-slate-300 px-2 py-2 outline-none" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="landmark" className="text-sm text-gray-500">landmark</label>
                        <input type="text" id="landmark" value={address.landmark} onChange={(e) => setAddress({ ...address, landmark: e.target.value })} className="w-full h-12 bg-gray-50 border border-slate-300 px-2 py-2 outline-none" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="text-sm text-gray-500">Tag</div>
                        <div className="w-full h-11 flex flex-row bg-gray-50 border border-slate-300 rounded-full overflow-hidden">
                            <div onClick={() => { setAddress({ ...address, tag: "HOME" }) }} className={`cursor-pointer transition duration-150 ${address.tag == "HOME" ? "bg-slate-900 fill-gray-100 text-gray-100" : " text-gray-600 fill-gray-600"} text-sm  flex justify-center items-center flex-1 w-full h-full border-r border-r-slate-300`}><span className=" scale-75">{homeTagSVG}</span>Home</div>
                            <div onClick={() => { setAddress({ ...address, tag: "WORK" }) }} className={`cursor-pointer transition duration-150 ${address.tag == "WORK" ? "bg-slate-900 fill-gray-100 text-gray-100" : " text-gray-600 fill-gray-600"} text-sm  flex justify-center items-center flex-1 w-full h-full border-r border-r-slate-300`}><span className=" scale-75">{workTagSVG}</span> Work</div>
                            <div onClick={() => { setAddress({ ...address, tag: "OTHER" }) }} className={`cursor-pointer transition duration-150 ${address.tag == "OTHER" ? "bg-slate-900 fill-gray-100 text-gray-100" : " text-gray-600 fill-gray-600"}  text-sm  flex justify-center items-center flex-1 w-full h-full `}><span className=" scale-75">{otherTagSVG}</span> other</div>
                        </div>
                    </div>
                    <div>
                        <button className="uppercase w-full h-12 bg-slate-900 text-white" onClick={() => { submitHandler() }}>submit</button>
                    </div>
                </div>
            </div >
        </div >


    </>

}

export const SellerRegister = () => {

    const [registerDetails, setRegisterDetails] = useState<RegisterDetails>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        contactNumber: ""
    })

    const { setUser, setLoggedIn } = useGenerationState()

    const router = useRouter()

    const registerHandler = async () => {
        if (registerDetails.firstName == "" || registerDetails.lastName == "" || registerDetails.email == "" || registerDetails.password == "" || registerDetails.contactNumber == "") return

        const response = await fetch(
            "http://localhost:8080/api/seller/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        name: registerDetails.firstName + " " + registerDetails.lastName,
                        email: registerDetails.email.toLowerCase(),
                        password: registerDetails.password,
                        contactNumber: registerDetails.contactNumber,
                    }
                )
            }
        )

        const res = await response.json()
        if (res.success) {
            setLoggedIn(true)
            localStorage.setItem("token", res.token)
            getUser(res.token)
            router.push("/")
        }
    }

    const getUser = async (token: string) => {
        const response = await fetch(`http://localhost:8080/api/user/me/${localStorage.getItem("token")}`)
        const res = await response.json()
        if (res.success) {
            setUser(
                {
                    name: res.user.name,
                    email: res.user.email,
                    userType: res.user.userType,
                    contact: res.user.contactNumber
                }
            )
        }
    }

    return <>

        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
                <div className="flex-1 w-full h-full">
                    <label htmlFor="firstName" className="text-sm text-gray-500">First Name</label>
                    <input value={registerDetails.firstName} onChange={(e) => setRegisterDetails({ ...registerDetails, firstName: e.target.value })} type="text" className="bg-gray-50 w-full h-12 border border-slate-300 outline-none px-2 py-2" />
                </div>
                <div className="flex-1 w-full h-full">
                    <label htmlFor="lastName" className="text-sm text-gray-500">Last Name</label>
                    <input value={registerDetails.lastName} onChange={(e) => setRegisterDetails({ ...registerDetails, lastName: e.target.value })} type="text" className="bg-gray-50 w-full h-12 border border-slate-300 outline-none px-2 py-2" />
                </div>
            </div>
            <div>
                <label htmlFor="email" className="text-sm text-gray-500">Email</label>
                <input value={registerDetails.email} onChange={(e) => setRegisterDetails({ ...registerDetails, email: e.target.value })} type="email" id="email" className="bg-gray-50 w-full h-12 border border-slate-300 outline-none px-2 py-2" />
            </div>
            <div>
                <label htmlFor="password" className="text-sm text-gray-500">Password</label>
                <input value={registerDetails.password} onChange={(e) => setRegisterDetails({ ...registerDetails, password: e.target.value })} type="password" id="password" className="bg-gray-50 w-full h-12 border border-slate-300 outline-none px-2 py-2" />
            </div>
            <div>
                <label htmlFor="contactNumber" className="text-sm text-gray-500">Contact Number</label>
                <input value={registerDetails.contactNumber} onChange={(e) => setRegisterDetails({ ...registerDetails, contactNumber: e.target.value })} type="tel" id="contactNumber" className="bg-gray-50 w-full h-12 border border-slate-300 outline-none px-2 py-2" />
            </div>
        </div>
        <div>
            <button onClick={() => { registerHandler() }} className="uppercase w-full h-12 bg-slate-900 text-white">Register</button>
        </div>

    </>
}

export const OptionalSideNav = ({ }) => {
    const { user } = useGenerationState()

    return <>

        {user?.userType == "user" ? <NavigationItems icon={sellerTagSVG} text="Become a Seller" link="/become/seller" /> : null}

        {user?.userType == "seller" ?
            <>
                <NavigationItems icon={productsTagSVG} text="Products" link="/manage/products" />
                <NavigationItems icon={orderBookTagSVG} text="Order Book" link="/manage/orders" />
                <NavigationItems icon={verifiedTag} text="Get Verified" link="/become/verified" />
            </>
            : null
        }

    </>
}

export const AddProduct = () => {

    const [showAddProduct, setShowAddProduct] = useState<boolean>(false)

    return <>

        {
            showAddProduct ? <AddProductDialog close={() => { setShowAddProduct(false) }} /> : null
        }

        <button onClick={() => { setShowAddProduct(true) }} className="bg-slate-900 absolute bottom-8 right-8 w-14 h-14 flex justify-center items-center rounded-full shadow">{plusSVG}</button>

    </>
}

interface ProductDetails {
    name: string,
    price: string,
    stock: string,
    category: string
}

const AddProductDialog = ({ close }: { close: () => void }) => {

    const [productDetails, setProductDetails] = useState<ProductDetails>(
        {
            name: "",
            price: "",
            stock: "",
            category: "",
        }
    )

    const router = useRouter()
    const submitHandler = async () => {

        if (productDetails.name == "" || productDetails.price == "" || productDetails.stock == "" || productDetails.category == "") return
        const response = await fetch(
            `http://localhost:8080/api/product/create/${localStorage.getItem("token")}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify(
                    {
                        name: productDetails.name,
                        price: productDetails.price,
                        stock: productDetails.stock,
                        category: productDetails.category,
                    }
                )
            }
        )
        const res = await response.json()
        console.log(res)
        if (res.success) {
            router.push(`/seller/products/${res.id}`)
        }

    }

    return <>

        <div className="w-screen h-screen absolute top-0 left-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
            <div className="w-1/3 p-4 bg-white rounded shadow-sm">
                <div className="flex flex-col gap-4 w-full h-full relative">
                    <div className="flex flex-col gap-1">
                        <div className="text-2xl text-gray-700 font-medium">
                            Add Product
                        </div>
                        <div className="text-sm text-gray-500">
                            Enter the basic details below to start the process
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div>
                            <label htmlFor="name" className="text-sm text-gray-500">Product Name</label>
                            <input value={productDetails.name} onChange={(e) => { setProductDetails({ ...productDetails, name: e.target.value }) }} type="text" id="name" className="w-full h-12 bg-gray-50 p-2 border border-slate-300 outline-none" />
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="flex-1">
                                <label htmlFor="stock" className="text-sm text-gray-500">stock</label>
                                <input value={productDetails.stock} onChange={(e) => { setProductDetails({ ...productDetails, stock: e.target.value }) }} type="text" id="stock" className="w-full h-12 bg-gray-50 p-2 border border-slate-300 outline-none" />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="price" className="text-sm text-gray-500">price</label>
                                <input value={productDetails.price} onChange={(e) => { setProductDetails({ ...productDetails, price: e.target.value }) }} type="text" id="price" className="w-full h-12 bg-gray-50 p-2 border border-slate-300 outline-none" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-sm text-gray-500">
                                Category
                            </div>
                            <div className="w-ful flex flex-row l h-11 bg-gray-50 rounded-full border-slate-900 border overflow-hidden">
                                <div onClick={() => { setProductDetails({ ...productDetails, category: "Mobile" }) }} className={`transition duration-150 cursor-pointer ${productDetails.category == "Mobile" ? "bg-slate-900 text-white" : "text-slate-900"} flex-1 flex justify-center items-center border-r border-slate-900`}>
                                    Mobile
                                </div>
                                <div onClick={() => { setProductDetails({ ...productDetails, category: "Furniture" }) }} className={`transition duration-150 cursor-pointer ${productDetails.category == "Furniture" ? "bg-slate-900 text-white" : "text-slate-900"} flex-1 flex justify-center items-center border-r border-slate-900`}>
                                    Furniture
                                </div>
                                <div onClick={() => { setProductDetails({ ...productDetails, category: "Appliance" }) }} className={`transition duration-150 cursor-pointer ${productDetails.category == "Appliance" ? "bg-slate-900 text-white" : "text-slate-900"} flex-1 flex justify-center items-center`}>
                                    Appliances
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => { submitHandler() }} className="uppercase bg-slate-900 text-white w-full h-12">
                            Add product
                        </button>
                    </div>
                    <button onClick={() => { close() }} className="absolute top-0 right-0">
                        {closeSVG}
                    </button>
                </div>
            </div>
        </div>

    </>
}

export const DelistedProducts = () => {

    const [products, setProducts] = useState<any>([])

    const fetchDelistedProducts = async () => {
        const response = await fetch(
            `http://localhost:8080/api/seller/get/delisted/products/${localStorage.getItem("token")}`
        )
        const res = await response.json()
        if (res.success) {
            console.log()
            setProducts([...res.products])
        }
    }

    useEffect(() => {
        fetchDelistedProducts()
    }, [])

    return <>

        <div className="w-full flex flex-row gap-4">
            {
                products.map((e: any) => <ProductCard product={e} />)
            }
        </div>

    </>
}

export const ListedProducts = () => {

    const [products, setProducts] = useState<any>([])

    const fetchListedProducts = async () => {
        const response = await fetch(
            `http://localhost:8080/api/seller/get/listed/products/${localStorage.getItem("token")}`
        )
        const res = await response.json()
        if (res.success) {
            setProducts([...res.products])
        }
    }

    useEffect(() => {
        fetchListedProducts()
    }, [])

    return <>


        <div className="w-full flex flex-row gap-4">
            {
                products.map((e: any) => <ProductCard product={e} />)
            }
        </div>

    </>

}

export const ProductCard = ({ product }: { product: any }) => {
    return <>

        <Link href={`/seller/products/${product._id}`} className="w-1/4 p-4 bg-gray-50 rounded shadow-sm flex flex-col gap-2">
            <div className="w-full aspect-square  rounded flex justify-center items-center bg-white ">
                {product.mainImage ? <img src={`http://localhost:8080/${product._id}/${product.mainImage.imageName}`} className="w-full flex justify-center items-center" /> : null}
            </div>
            <div className="flex flex-col gap-1 w-full">
                <div className="text-md text-gray-700 font-medium">
                    {product.name}
                </div>
                <div className="flex flex-row w-full justify-between items-center text-sm text-gray-500 font-light">
                    <div>
                        $ {product.price}
                    </div>
                    <div>
                        {product.stock}
                    </div>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <span className="scale-75">
                        {starSVG}
                    </span>
                    <span className="text-sm font-light">
                        {product.rating}
                    </span>
                </div>
            </div>
        </Link>

    </>
}

export const HeaderForExplore = () => {
    const { user, loggedIn } = useGenerationState()
    return <div>
        <div className="text-3xl font-semibold text-gray-700">
            Welcome {loggedIn ? user?.name : ""},
        </div>
        <div className="text-sm font-light text-gray-500">
            What are we finding today,
        </div>
    </div>
}

export const AddToCartAndBuyNow = ({ id }: { id: string }) => {

    const { loggedIn } = useGenerationState()

    const addToCartHandler = async () => {

        if (!loggedIn) return

        const response = await fetch(`http://localhost:8080/api/user/cart/add/${id}/${localStorage.getItem("token")}`, {
            method: "PUT"
        })

        const res = await response.json()
        console.log(res)
        if (res.success) {
            alert("added to cart")
        }

    }

    const buyNowHandler = () => {
    }

    return <>

        <div className=" flex flex-col gap-2">
            <button onClick={() => { addToCartHandler() }} className="w-full h-12 bg-slate-900 text-white uppercase ">Add to cart</button>
            <button className="w-full h-12 border border-slate-900 text-slate-900 uppercase ">Buy Now</button>
        </div>
    </>
}

export const ProductCartCard = ({ productId, quantity, update }: { productId: any, quantity: number, update: () => void }) => {

    const [product, setProduct] = useState<any>()

    const getProduct = async () => {
        const response = await fetch(`http://localhost:8080/api/product/${productId}`)
        const res = await response.json()
        if (res.success) {
            setProduct(res.product)
        }
    }

    const removeProduct = async () => {
        const response = await fetch(
            `http://localhost:8080/api/user/cart/${productId}/${localStorage.getItem("token")}`,
            {
                method: "DELETE"
            }
        )
        const res = await response.json()
        if (res.success) {
            update()
        }
    }

    const [newQuantity, setNewQuantity] = useState("")

    const setQuantity = async () => {

        if (newQuantity == "") return

        const response = await fetch(
            "http://localhost:8080/api/user/cart/update/quantity",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        token: localStorage.getItem('token'),
                        id: productId,
                        quantity: newQuantity,
                    }
                )
            }
        )

        const res = await response.json()
        if (res.success) {
            update()
            setEdit(false)
        } else {
            console.log(res)
            setEdit(false)
        }

    }



    useEffect(() => {
        getProduct()
    }, [])

    const [edit, setEdit] = useState<boolean>(false)

    const router = useRouter()

    return <>

        {product ? <div className="w-full h-44 shadow-sm rounded p-4 bg-gray-50">
            <div className="w-full h-full flex flex-row gap-4">
                <div className="h-full aspect-square bg-white flex justify-center items-center rounded">
                    <img src={`http://localhost:8080/${productId}/${product.mainImage.imageName}`} alt="" />
                </div >
                <div className="flex-1 w-full h-full flex flex-col justify-between">

                    <div>
                        <div className="text-xl font-medium text-slate-900" >
                            {product.name}
                        </div>
                        <div className="text-sm font-light text-gray-500">
                            {product.subtitle}
                        </div>
                    </div>
                    <div className="text-lg font-normal text-slate-700">
                        <span>
                            $
                        </span>
                        <span>
                            {product.price}
                        </span>
                    </div>
                    <div className="flex flex-row gap-1 px-3 py-1 items-center bg-red-100 w-fit rounded shadow-red-100 shadow-sm ">
                        <span className="flex justify-center items-center h-full text-lg text-red-600">
                            {product.rating}
                        </span>
                        <span className=" flex justify-center items-center h-full fill-red-600">
                            {starSVG}
                        </span>
                    </div>
                    <div className="text-md font-light text-gray-500">
                        Quantity : {edit ? <input type="tel" value={newQuantity} onChange={(e) => { setNewQuantity(e.target.value) }} className="bg-gray-50 outline-none px-0 py-0" placeholder="enter new quantity" /> : quantity}
                    </div>
                </div>
                <div className="flex flex-col justify-evenly">
                    {edit ?
                        <button onClick={() => {
                            setQuantity()
                        }} className="scale-75">
                            <span>
                                {doneTagSVG}
                            </span>
                        </button>
                        : <button onClick={() => { setEdit(true) }} className="scale-75">
                            <span>
                                {editTagSVG}
                            </span>
                        </button>}
                    <button onClick={() => { removeProduct() }} className="scale-75">
                        <span>
                            {deleteSVG}
                        </span>
                    </button>
                </div>
            </div >
        </div >
            : < div className="w-full h-44 shadow-sm rounded p-4 bg-gray-50">
                <div className="w-full h-full flex flex-row">
                    <div className="h-full aspect-square bg-white rounded">
                    </div>
                    <div>

                    </div>
                </div>
            </div >
        }
    </>
}

export const PriceFeedForCart = () => {
    return <>

        <div className="w-full h-full p-4 flex flex-col gap-6">
            <div className="text-3xl font-medium text-gray-400">
                Price List
            </div>
            <div className="flex flex-col gap-3">
                <div className="w-full flex justify-between">
                    <span className="text-md text-gray-700">
                        MRP (1 items)
                    </span>
                    <span className="text-md text-gray-500">
                        20 $
                    </span>
                </div>
                <div className="w-full flex justify-between">
                    <span className="text-md text-gray-700">
                        Delivery Charges
                    </span>
                    <span className="text-md text-gray-500">
                        50 $
                    </span>
                </div>
                <div className="w-full flex justify-between">
                    <span className="text-md text-gray-700">
                        Total
                    </span>
                    <span className="text-md text-gray-500">
                        70 $
                    </span>
                </div>
            </div>
            <div className="w-full h-full flex-1">

            </div>
            <div className="w-full h-12">
                <button className="w-full h-full bg-slate-900 text-white uppercase">Checkout</button>
            </div>
        </div>

    </>
}

export const AddToWishlist = ({ id }: { id: string }) => {

    const [wishlist, setWishlist] = useState<boolean>(false)

    const { loggedIn } = useGenerationState()

    const checkWishlist = async () => {
        const response = await fetch(`http://localhost:8080/api/user/wishlist/${localStorage.getItem("token")}/${id}`)
        const res = await response.json()
        if (res.success) {
            setWishlist(true)
            return true
        }
        return false
    }

    const removeWishlist = async () => {
        if (!loggedIn) return
        const wish = await checkWishlist()
        if (!wish) return
        const response = await fetch(
            `http://localhost:8080/api/user/wishlist/${localStorage.getItem("token")}/${id}`,
            {
                method: "DELETE"
            }
        )
        const res = await response.json()
        if (res.success) {
            setWishlist(false)
        }
    }

    const addToWishlist = async () => {
        if (!loggedIn) return
        const wish = await checkWishlist()
        if (wish) return
        const response = await fetch(
            `http://localhost:8080/api/user/wishlist/${localStorage.getItem("token")}/${id}`,
            {
                method: "PUT"
            }
        )
        const res = await response.json()
        if (res.success) {
            setWishlist(true)
        }
    }


    useEffect(() => {
        checkWishlist()
    }, [])

    return <>

        <div className="absolute top-4 right-4">
            {wishlist ? <button onClick={() => { removeWishlist() }} className="p-2 rounded-full border border-red-100 bg-red-100 fill-red-600">
                {heartFillSVG}
            </button> : < button onClick={() => { addToWishlist() }} className="p-2 rounded-full border border-red-100 bg-red-100 fill-red-600">
                {heartSVG}
            </button>}
        </div >

    </>
}

export const Wishlist = () => {

    const [wishlist, setWishlist] = useState<Array<any>>([])

    const getWishlist = async () => {
        const response = await fetch(`http://localhost:8080/api/user/wishlist/${localStorage.getItem("token")}`)
        const res = await response.json()
        if (res.success) {
            setWishlist([...res.products])
        }
    }

    useEffect(() => {
        getWishlist()
    }, [])

    return <>

        <div className="overflow-y-scroll gap-4 flex-1 w-full flex flex-row flex-wrap items-center justify-between">
            {wishlist.map((e) => <ProductCardClient product={e} />)}
        </div>

    </>
}