const expresss = require("express");
const errorHandler = require("../utils/errorHandler");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const path = require("path")

const router = expresss.Router()
dotenv.config(
    {
        path: path.resolve("./.env")
    }
)

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

module.exports = router
