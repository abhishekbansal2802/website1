// imports
const expresss = require("express");
const errorHandler = require("../utils/errorHandler");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const path = require("path");
const ProductModel = require("../models/ProductModel");
const AddressModel = require("../models/AddressModel");

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

// change password
router.put("/change/password/:token", async (req, res) => {
    const { password, newPassword, confNewPassword } = req.body
    if (!password || !newPassword || !confNewPassword) return errorHandler(res, 404, "not enough data")
    if (newPassword != confNewPassword) return errorHandler(res, 404, "passwords are not same")
    const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
    if (!id) return errorHandler(res, 401, "not authorized")
    try {
        const user = await UserModel.findById(id).select("+password");
        if (!user) return errorHandler(res, 404, "not found")
        const compare = await bcrypt.compare(password, user.password);
        if (!compare) return errorHandler(res, 401, "password not same")
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword;
        await user.save()
        return res.status(200).json({ success: true, message: "password changed" })
    } catch (err) {
        return errorHandler(res)
    }
})

// add product to user cart
router.put("/cart/add/:id/:token", async (req, res) => {
    try {
        const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
        if (!id) return errorHandler(res, 401, "not authorized")
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "user not found")
        const product = await ProductModel.findById(req.params.id)
        if (!product) return errorHandler(res, 404, "not found")
        const items = user.cart.find((e) => e.productId.toString() == product._id.toString())
        if (items) return errorHandler(res, 401, "already exists")
        user.cart.push({
            productId: product._id,
            quantity: 1,
        })
        await user.save()
        return res.status(200).json({ success: true, message: "added to cart" })
    } catch (err) {
        console.log(err)
        return errorHandler(res)
    }
})

router.get("/cart/:token", async (req, res) => {
    try {
        const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
        if (!id) return errorHandler(res, 401, "not found")
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "not found")
        return res.status(200).json({ success: true, message: "cart send", cart: user.cart })
    } catch (err) {
        return errorHandler(res)
    }
})

router.put("/cart/update/quantity", async (req, res) => {
    try {
        const { token, id, quantity } = req.body;
        if (!token || !id || !quantity) return errorHandler(res, 401, "not enough data")
        const decodedToken = jwt.decode(token, process.env.SECRET_KEY)
        if (!decodedToken.id) return errorHandler(res, 401, "not enough data")
        const user = await UserModel.findById(decodedToken.id)
        if (!user) return errorHandler(res, 401, "user not found")
        const product = await ProductModel.findById(id)
        if (!product) return errorHandler(res, 404, "product not found")
        if (quantity > product.stock) return errorHandler(res, 401, "not enough quantity")
        user.cart = user.cart.map((e) => {
            if (e.productId.toString() === id.toString()) {
                return {
                    productId: id,
                    quantity: quantity,
                }
            }
            return e
        })
        await user.save()
        return res.status(200).json({ success: true, message: "user updated successfully" })
    } catch (err) {
        console.log(err)
        return errorHandler(res)
    }
})

router.delete("/cart/:id/:token", async (req, res) => {
    try {
        const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
        if (!id) return errorHandler(res, 401, "data not found")
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "user not found")
        user.cart = user.cart.filter((e) => e.productId.toString() !== req.params.id.toString())
        await user.save()
        return res.status(200).json({ success: true, message: "removed from cart" })
    } catch (err) {
        return errorHandler(res)
    }
})

router.get("/wishlist/:token/:id", async (req, res) => {
    try {
        const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
        if (!id) return errorHandler(res, 401, " not enough")
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "user not found")
        const contains = user.wishlist.find((e) => e.toString() === req.params.id)
        console.log(contains)
        if (!contains) return errorHandler(res, 404, "product not in wishlist")
        return res.status(200).json({ success: true, message: "product in wishlist" })
    } catch (err) {
        console.log(err)
        return errorHandler(res)
    }
})

router.put("/wishlist/:token/:id", async (req, res) => {
    try {
        const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
        if (!id) return errorHandler(res, 401, " not enough")
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "user not found")
        const item = user.wishlist.find((e) => e.toString() === req.params.id.toString())
        if (item) {
            user.wishlist = user.wishlist.filter((e) => e.toString() !== req.params.id.toString())
        } else {
            user.wishlist.push(req.params.id)
        }
        await user.save()
        return res.status(200).json({ success: true, message: "product added" })
    } catch (err) {
        console.log(err);
        return errorHandler(res)
    }
})

router.get("/wishlist/:token", async (req, res) => {
    try {
        const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
        if (!id) return errorHandler(res, 401, " not enough")
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "user not found")
        const products = await ProductModel.find({ _id: user.wishlist })
        return res.status(200).json({ success: true, message: "wishlist got", products })
    } catch (err) {
        return errorHandler(res)
    }
})

router.get("/selected/address/:token", async (req, res) => {
    const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
    if (!id) return errorHandler(res, 401, "error Parsing id")
    try {
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "user not found")
        if (!user.selectedAddress) return errorHandler(res, 401, "no address selected")
        const address = await AddressModel.findById(user.selectedAddress)
        return res.status(200).json({ success: true, message: "address fetched", address })
    } catch (err) {
        return errorHandler(res)
    }
})

router.put("/selected/address/:token/:id", async (req, res) => {
    const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
    if (!id) return errorHandler(res, 401, "data not foudn")
    try {
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "user not found")
        const address = await AddressModel.findById(req.params.id)
        if (!address) return errorHandler(res, 404, "address not found")
        user.selectedAddress = address._id
        await user.save()
        return res.status(200).json({ success: true, message: "sent successfully" })
    } catch (err) {
        return errorHandler(res)
    }
})

router.get("/cart/price/:token", async (req, res) => {
    const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
    if (!id) return errorHandler(res, 401, "not found")
    try {
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "user not found")
        const productToIds = {}
        const productIds = user.cart.map((e) => {
            productToIds[e.productId.toString()] = e.quantity
            return e.productId
        })
        const products = await ProductModel.find({ _id: productIds })
        let price = 0
        for (const product of products) {
            price += product.price * productToIds[product._id.toString()]
        }
        return res.status(200).json({
            success: true, message: "price fetched", price: {
                MRP: price,
                delivery: 200,
                subtotal: price + 200
            }
        })
    } catch (err) {
        return errorHandler(res)
    }
})

router.get("/order/:token", async (req, res) => {
    const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
    if (!id) return errorHandler(res, 401, "not foudn")
    try {
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "not found")
        return res.status(200).json({ success: true, message: "orders sent", orders: user.orders })
    } catch (err) {
        return errorHandler(res)
    }
})

module.exports = router
