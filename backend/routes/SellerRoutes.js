const express = require("express")
const errorHandler = require("../utils/errorHandler")
const dotenv = require("dotenv")
const path = require("path")
const UserModel = require("../models/UserModel")
const SellerModel = require("../models/SellerModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const ProductModel = require("../models/ProductModel")

const router = express.Router()
dotenv.config(
    {
        path: path.resolve("./.env")
    }
)

router.post("/register", async (req, res) => {
    const { email, password, name, contactNumber } = req.body
    if (!email || !password || !name || !contactNumber) return errorHandler(res, 401, "not enough data")
    try {
        let user = await UserModel.findOne({ email: email.toLowerCase() })
        if (user) return errorHandler(res, 401, "user already exists")
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await UserModel.create(
            {
                name: name,
                email: email.toLowerCase(),
                password: hashedPassword,
                contactNumber: contactNumber,
                userType: "seller",
            }
        )
        const seller = await SellerModel.create(
            {
                email: email.toLowerCase(),
                userId: user._id,
            }
        )
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY)
        return res.status(200).json({ success: true, message: "seller created", token })
    } catch (err) {
        return errorHandler(res)
    }
})

router.put("/convert/:token", async (req, res) => {
    const { id } = jwt.decode(req.paras.token, process.env.SECRET_KEY)
    if (!id) return errorHandler(res, 401, "not authorized")
    try {

        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, 'not authorized')
        const seller = await SellerModel.create(
            {
                email: user.email,
                userId: user._id,
            }
        )
        user.userType = "seller"
        await user.save()
        return res.status(200).json({ success: true, message: "user converted" })
    } catch (err) {
        return errorHandler(res)
    }
})

router.get("/get/listed/products/:token", async (req, res) => {
    const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
    if (!id) return errorHandler(res, 401, "id is not correct")
    try {
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "not authorized")
        const seller = await SellerModel.findOne({ userId: user._id })
        if (!seller) return errorHandler(res, 401, "not authorized")
        const ids = seller.listedProducts;
        const products = await ProductModel.find({ _id: ids })
        return res.status(200).json({ success: true, message: "product sent", products })
    } catch (err) {
        return errorHandler(res)
    }
})

router.get("/get/delisted/products/:token", async (req, res) => {
    const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
    if (!id) return errorHandler(res, 401, "id is not correct")
    try {
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "not authorized")
        const seller = await SellerModel.findOne({ userId: user._id })
        if (!seller) return errorHandler(res, 401, "not authorized")
        const ids = seller.delistedProducts;
        const products = await ProductModel.find({ _id: ids })
        return res.status(200).json({ success: true, message: "product sent", products })
    } catch (err) {
        return errorHandler(res)
    }
})

router.get("/:id", async (req, res) => {
    try {
        const product = await ProductModel.findOne({ _id: req.params.id }).select("+userId")
        const user = await UserModel.findOne({ _id: product.userId })
        const result = {
            name: user.name,
            email: user.email,
            contact: user.contactNumber,
            id: user._id.toString()
        }
        return res.status(200).json({ success: true, message: "seller fetched", data: result })
    } catch (err) {
        console.log(err)
        return errorHandler(res)
    }
})

router.put("/list/:id/:token", async (req, res) => {
    const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
    if (!id) return errorHandler(res, 401, "error While depackaging id")
    try {
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "error while finding user")
        const seller = await SellerModel.findOne({ userId: user._id })
        if (!seller) return errorHandler(res, 401, "seller not found")
        const product = await ProductModel.findOne({ _id: req.params.id, userId: user._id })
        if (product.listed) return errorHandler(res, 400, "alerady listed")
        if (!product) return errorHandler(res, 404, "not found")
        if (!product.name || !product.price || !product.stock || !product.subtitle || product.highlights.length < 5 || product.features.length == 0 || !product.mainImage || !product.images || !product.images.image1 || !product.images.image2 || !product.images.image3 || !product.images.image4) {
            return errorHandler(res, 401, "product can't be listed")
        }
        product.listed = true;
        await product.save()
        seller.delistedProducts = seller.delistedProducts.filter((e) => e.toString() != product._id.toString())
        seller.listedProducts.push(product._id)
        await seller.save()
        return res.status(200).json({ success: true, message: "product listed" })
    } catch (err) {
        return errorHandler(res)
    }
})

router.put("/delist/:id/:token", async (req, res) => {
    const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
    if (!id) return errorHandler(res, 401, "error While depackaging id")
    try {
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "error while finding user")
        const seller = await SellerModel.findOne({ userId: user._id })
        if (!seller) return errorHandler(res, 401, "seller not found")
        const product = await ProductModel.findOne({ _id: req.params.id, userId: user._id })
        if (!product.listed) return errorHandler(res, 400, "alerady delisted")
        if (!product) return errorHandler(res, 404, "not found")
        product.listed = false;
        await product.save()
        seller.listedProducts = seller.listedProducts.filter((e) => e.toString() != product._id.toString())
        seller.delistedProducts.push(product._id)
        await seller.save()
        return res.status(200).json({ success: true, message: "product delisted" })
    } catch (err) {
        return errorHandler(res)
    }
})

module.exports = router;