const express = require("express")
const dotenv = require("dotenv")
const path = require("path")
const jwt = require("jsonwebtoken")
const errorHandler = require("../utils/errorHandler")
const UserModel = require("../models/UserModel")
const AddressModel = require("../models/AddressModel")

const router = express.Router()
dotenv.config(
    {
        path: path.resolve("./.env")
    }
)

router.post("/add/:token", async (req, res) => {
    const { flatNo, society, street, city, state, pincode, landmark, tag } = req.body
    if (!flatNo || !society || !street || !city || !state || !pincode || !landmark || !tag) return errorHandler(res, 401, "not enough data")
    const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
    if (!id) return errorHandler(res, 401, "user authentication failed")
    try {
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 404, "not found")
        const address = await AddressModel.create(
            {
                flatNo,
                society,
                street,
                city,
                state,
                pincode,
                landmark,
                tag,
                userId: user._id,
            }
        )
        user.address.push(address)
        await user.save()
        return res.status(201).json({ success: true, message: "user created" })
    } catch (err) {
        return errorHandler(res)
    }
})

router.get("/:token", async (req, res) => {
    const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
    if (!id) return errorHandler(res, 401, "not authorized")
    try {
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "not authorized")
        const address = await AddressModel.find({ userId: user._id })
        console.log(address)
        return res.status(200).json({ success: true, message: "address fetched", address })
    } catch (err) {
        return errorHandler(res)
    }
})

router.delete("/:token/:id", async (req, res) => {
    const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
    if (!id) return errorHandler(res, 401, "not authorized")
    try {
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "not authorized")
        const deletedAddress = await AddressModel.deleteOne({ _id: req.params.id })
        user.address = user.address.filter((e) => e.toString() != req.params.id.toString())
        await user.save()
        return res.status(200).json({ success: true, message: "address deleted" })
    }
    catch (err) {
        return errorHandler(res)
    }
})

module.exports = router