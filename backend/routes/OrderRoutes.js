const express = require("express")
const errorHandler = require("../utils/errorHandler")
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv')
const path = require("path")
const UserModel = require("../models/UserModel")
const ProductModel = require("../models/ProductModel")
const OrderModel = require("../models/OrderModel")
const SellerModel = require("../models/SellerModel")
const AddressModel = require("../models/AddressModel")

dotenv.config(
    {
        path: path.resolve("./.env")
    }
)

const router = express.Router()

router.post("/create/cart", async (req, res) => {
    const { token } = req.body
    if (!token) return errorHandler(res, 401, "not authorized")
    const { id } = jwt.decode(token, process.env.SECRET_KEY)
    if (!id) return errorHandler(res, 401, "id invalid")
    try {
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "user not found")
        if (!user.selectedAddress) return errorHandler(res, 401, "address not given")
        const cart = user.cart;
        const productWithQuantity = {}
        const productIds = cart.map((e) => {
            productWithQuantity[e.productId.toString()] = e.quantity
            return e.productId;
        })
        const products = await ProductModel.find({ _id: productIds }).select("+sellerId")
        const newArr = products.map((e) => {
            return {
                productId: e._id,
                sellerId: e.sellerId,
                quantity: productWithQuantity[e._id.toString()],
                price: {
                    MRP: e.price,
                    delivery: 200,
                    subtotal: e.price + 200

                },
                orderStatus: "confirmed"
            }
        })
        for (const product of products) {
            if (product.stock - productWithQuantity[product._id.toString()] < 0) {
                return errorHandler(res, 401, "stock out")
            }
        }
        const order = await OrderModel.create(
            {
                userId: user._id,
                products: newArr,
                address: user.selectedAddress,
                contactNumber: user.contactNumber,
                orderStatus: "confirmed",
                modeOfPayment: "UPI",
            }
        )
        for (const product of products) {
            product.stock = product.stock - productWithQuantity[product._id.toString()]
            await product.save()
            const seller = await SellerModel.findById(product.sellerId)
            seller.orders.push(order._id)
            await seller.save()
        }
        user.cart = []
        user.orders.push(order._id)
        await user.save()
        return res.status(200).json({ success: true, message: "order created", })
    } catch (err) {
        console.log(err)
        return errorHandler(res)
    }
})

router.post("/products/:id", async (req, res) => {
    const { token } = req.body
    if (!token) return errorHandler(res, 401, "token not received")
    try {
        const { id } = jwt.decode(token, process.env.SECRET_KEY)
        if (!id) return errorHandler(res, 401, "id not found")
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "user not found")
        const order = await OrderModel.findOne({ _id: req.params.id, userId: user._id })
        if (!order) return errorHandler(res, 401, "user not found")
        const productsToQuantity = {}
        const productToStatus = {}
        const productIds = order.products.map((e) => {
            productsToQuantity[e.productId.toString()] = e.quantity
            productToStatus[e.productId.toString()] = e.orderStatus
            return e.productId
        })
        const products = await ProductModel.find({ _id: productIds })
        const result = products.map((e) => {
            return {
                product: e,
                quantity: productsToQuantity[e._id.toString()],
                status: productToStatus[e._id.toString()]
            }
        })
        return res.status(200).json({ success: true, message: "true", orders: result })
    } catch (err) {
        console.log(err)
        return errorHandler(res)
    }
})


router.get("/seller/:token/:id", async (req, res) => {

    console.log("called")

    try {
        const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
        if (!id) return errorHandler(res, 404, "id not user not found")
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 404, "user not found")
        const seller = await SellerModel.findOne({ userId: user._id })
        if (!seller) return errorHandler(res, 401, "seller not found")
        const order = await OrderModel.findById(req.params.id)
        const products = order.products.filter((e) => {
            return e.sellerId.toString() == seller._id.toString()
        })
        return res.status(200).json({ success: true, message: "products found", products })
    } catch (err) {
        console.log(err)
        return errorHandler(res)
    }
})

router.get("/seller/:token/:id/:productId", async (req, res) => {
    try {
        const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
        if (!id) return errorHandler(res, 404, "user not found")
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 404, "user not found")
        const seller = await SellerModel.findOne({ userId: user._id })
        if (!seller) return errorHandler(res, 404, "seller not found")
        const order = await OrderModel.findById(req.params.id)
        if (!order) return errorHandler(res, 404, "order not found")
        const product = order.products.find((e) => {
            return ((e.productId.toString() == req.params.productId.toString()) && (e.sellerId.toString() == seller._id.toString()))
        })
        const newProduct = await ProductModel.findById(product.productId)
        if (!newProduct) return errorHandler(res, 401, "product not found")
        const address = await AddressModel.findById(order.address)
        const details = {
            product: newProduct,
            quantity: product.quantity,
            status: product.orderStatus,
            address: address,
            name: user.name,
            contactNumber: order.contactNumber
        }
        return res.status(200).json({ success: true, message: "details sent", product: details })
    } catch (err) {
        return errorHandler(res)
    }
})


router.get("/:token/:id/:productId", async (req, res) => {

    try {
        const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
        if (!id) return errorHandler(res, 401, "error not found")
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "user not found")
        const order = await OrderModel.findOne({ _id: req.params.id, userId: user._id })
        if (!order) return errorHandler(res, 404, "product not found")
        const productDetails = order.products.find((e) => e.productId.toString() == req.params.productId.toString())
        if (!productDetails) return errorHandler(res, 404, "not found")
        const address = await AddressModel.findById(order.address)
        if (!address) return errorHandler(res, 401, "address not found")
        const contactNumber = order.contactNumber
        const product = await ProductModel.findById(productDetails.productId)
        if (!product) return errorHandler(res, 404, "not found")
        const details = {
            product: product,
            quantity: productDetails.quantity,
            address: address,
            contactNumber: contactNumber,
            name: user.name,
            status: productDetails.orderStatus
        }
        return res.status(200).json({ success: true, message: "order found", product: details })
    } catch (err) {
        console.log(err)
        return errorHandler(res)
    }
})

router.put("/cancel/:token/:id/:productid", async (req, res) => {

    try {
        const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
        if (!id) return errorHandler(res, 401, "error handler kicked in yoo")
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 404, "user not found")
        const order = await OrderModel.findById(req.params.id)
        if (!order) return errorHandler(res, 404, "order not found")
        order.products = order.products.map((e) => {
            if (e.productId.toString() === req.params.productid.toString()) {
                e.orderStatus = "cancelled"
            }
            return e
        })
        await order.save()
        return res.status(200).json({ success: true, message: "product canclled" })
    }
    catch (err) {
        console.log(err)
        return errorHandler(res)
    }
})

router.put("/transit/:token/:id/:productid", async (req, res) => {

    try {
        const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
        if (!id) return errorHandler(res, 401, "error handler kicked in yoo")
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 404, "user not found")
        const order = await OrderModel.findById(req.params.id)
        if (!order) return errorHandler(res, 404, "order not found")
        order.products = order.products.map((e) => {
            if (e.productId.toString() === req.params.productid.toString()) {
                e.orderStatus = "in transit"
            }
            return e
        })
        await order.save()
        return res.status(200).json({ success: true, message: "product canclled" })
    }
    catch (err) {
        console.log(err)
        return errorHandler(res)
    }
})


module.exports = router