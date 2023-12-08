// imports
const expresss = require("express");
const errorHandler = require("../utils/errorHandler");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const path = require("path")

// initializations
const router = expresss.Router()
dotenv.config(
    {
        path: path.resolve("./.env")
    }
)

// register a user 
router.post("/register", async (req, res) => {
    const { email, name, password, contactNumber } = req.body;
    if (!email || !name || !password || !contactNumber) return errorHandler(res, 401, "not enough data")
    try {
        let user = await UserModel.findOne({ email: email.toLowerCase() })
        if (user) return errorHandler(res, 401, "user already exists")
        const hashedPassword = await bcrypt.hash(password, 10)
        user = await UserModel.create(
            {
                name: name,
                email: email.toLowerCase(),
                password: hashedPassword,
                contactNumber: contactNumber
            }
        )
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY)
        return res.status(201).json({ success: true, message: "user created", token })

    } catch (err) {
        console.log(err)
        return errorHandler(res)
    }
})

// login a user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return errorHandler(res, 401, "not enough data")
    try {
        let user = await UserModel.findOne({ email: email.toLowerCase() }).select("+password")
        if (!user) return errorHandler(res, 401, "either email or password is incorrect")
        const compare = await bcrypt.compare(password, user.password)
        if (!compare) return errorHandler(res, 401, "either email or passwowrd is wrong")
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY)
        return res.status(200).json({ success: true, message: "logged in", token })
    } catch (err) {
        console.log(err)
        return res.send("new world")
    }
})

// get profile info about a user
router.get("/me/:token", async (req, res) => {
    const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY);
    if (!id) return errorHandler(res, 401, "not authorized")
    try {
        let user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 404, "not found")
        return res.status(200).json({ success: true, message: "user found", user: user })
    } catch (err) {
        return errorHandler(res)
    }
})



module.exports = router
