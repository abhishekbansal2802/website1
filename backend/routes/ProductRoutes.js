const express = require("express")
const dotenv = require("dotenv")
const path = require("path")
const jwt = require("jsonwebtoken")
const errorHandler = require("../utils/errorHandler")
const UserModel = require("../models/UserModel")
const SellerModel = require("../models/SellerModel")
const fs = require("fs")
const ProductModel = require("../models/ProductModel")
const multer = require("multer")
const crypto = require('crypto')
const AnalyticsModel = require("../models/AnalyticsModel")

const router = express.Router()
dotenv.config(
    {
        path: path.resolve("./.env")
    }
)
const storage = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            const rootDir = path.resolve("./public")
            if (!fs.existsSync(rootDir)) {
                fs.mkdirSync(rootDir)
            }
            console.log(rootDir)
            const { id } = req.body
            const folderPath = path.resolve(`./public/${id}`)
            console.log(folderPath, !fs.existsSync(folderPath))
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath)
            }
            cb(null, folderPath)
        },
        filename: (req, file, cb) => {
            const fileName = `${Date.now()}-${crypto.randomUUID()}.jpg`
            console.log(fileName)
            cb(null, fileName)
        }
    }
)

const featuresStorage = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            const { id } = req.body
            const rootDir = path.resolve(`./public/${id}`)
            if (!fs.existsSync(rootDir)) {
                fs.mkdirSync(rootDir)
            }
            const featureDir = path.resolve(`./public/${id}/features`)
            if (!fs.existsSync(featureDir)) {
                fs.mkdirSync(featureDir)
            }
            cb(null, featureDir)
        },
        filename: (req, file, cb) => {
            const fileName = `${Date.now()}-${crypto.randomUUID()}.jpg`
            cb(null, fileName)
        }
    }
)

const upload = multer({ storage })

const featuresUpload = multer({ storage: featuresStorage })

router.post("/create/:token", async (req, res) => {
    const { name, price, stock, category } = req.body
    const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
    if (!id) return errorHandler(res, 401, "not authorized")
    try {
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "not authorized")
        const seller = await SellerModel.findOne({ userId: user._id })
        if (!seller) return errorHandler(res, 401, "not seller")
        const product = await ProductModel.create(
            {
                name: name,
                price: price,
                stock: stock,
                sellerId: seller._id,
                userId: user._id,
                category: category,
            }
        )
        const date = new Date()
        await AnalyticsModel.create(
            {
                id: product._id,
                category: category,
                todayDate: date.toLocaleDateString("en-GB")
            }
        )
        seller.delistedProducts.push(product._id);
        await seller.save()
        return res.status(201).json({ success: true, message: "product created", id: product._id })
    } catch (err) {
        console.log(err)
        return errorHandler(res)
    }
})

router.get("/:token/:id", async (req, res) => {
    const { id } = jwt.decode(req.params.token, process.env.SECRET_KEY)
    if (!id) return errorHandler(res, 401, "not authorized")
    try {
        const user = await UserModel.findById(id)
        if (!user) return errorHandler(res, 401, "not authorized")
        const seller = await SellerModel.findOne({ userId: user._id })
        if (!seller) return errorHandler(res, 401, "not authorized")
        const product = await ProductModel.findOne({ _id: req.params.id, sellerId: seller._id })
        if (!product) return errorHandler(res, 404, "not found")
        return res.status(200).json({ success: true, message: "product found", product })
    } catch (err) {
        console.log(err)
        return errorHandler(res)
    }
})

router.post("/set/name", async (req, res) => {

    const { token, id, name } = req.body
    console.log(token, id, name)
    if (!token || !id || !name) return errorHandler(res, 401, "not enough data")
    const newId = jwt.decode(token, process.env.SECRET_KEY)
    if (!newId.id) return errorHandler(res, 401, "error Handler")
    try {
        const user = await UserModel.findById(newId.id)
        if (!user) return errorHandler(res, 401, "not authorized")
        const product = await ProductModel.findOne({ _id: id, userId: user._id })
        if (!product) return errorHandler(res, 401, "not authorized")
        product.name = name;
        await product.save()
        return res.status(200).json({ success: true, message: "product updated" })
    } catch (err) {
        return errorHandler(res)
    }

})

router.post("/set/subtitle", async (req, res) => {

    const { token, id, subtitle } = req.body
    if (!token || !id || !subtitle) return errorHandler(res, 401, "not enough data")
    const newId = jwt.decode(token, process.env.SECRET_KEY)
    if (!newId.id) return errorHandler(res, 401, "error Handler")
    try {
        const user = await UserModel.findById(newId.id)
        if (!user) return errorHandler(res, 401, "not authorized")
        const product = await ProductModel.findOne({ _id: id, userId: user._id })
        if (!product) return errorHandler(res, 401, "not authorized")
        product.subtitle = subtitle;
        await product.save()
        return res.status(200).json({ success: true, message: "product updated" })
    } catch (err) {
        return errorHandler(res)
    }

})

router.post("/set/price", async (req, res) => {

    const { token, id, price } = req.body
    if (!token || !id || !price) return errorHandler(res, 401, "not enough data")
    const newId = jwt.decode(token, process.env.SECRET_KEY)
    if (!newId.id) return errorHandler(res, 401, "error Handler")
    try {
        const user = await UserModel.findById(newId.id)
        if (!user) return errorHandler(res, 401, "not authorized")
        const product = await ProductModel.findOne({ _id: id, userId: user._id })
        if (!product) return errorHandler(res, 401, "not authorized")
        product.price = price;
        await product.save()
        return res.status(200).json({ success: true, message: "product updated" })
    } catch (err) {
        return errorHandler(res)
    }
})

router.post("/set/stock", async (req, res) => {

    const { token, id, stock } = req.body
    if (!token || !id || !stock) return errorHandler(res, 401, "not enough data")
    const newId = jwt.decode(token, process.env.SECRET_KEY)
    if (!newId.id) return errorHandler(res, 401, "error Handler")
    try {
        const user = await UserModel.findById(newId.id)
        if (!user) return errorHandler(res, 401, "not authorized")
        const product = await ProductModel.findOne({ _id: id, userId: user._id })
        if (!product) return errorHandler(res, 401, "not authorized")
        product.stock = stock;
        await product.save()
        return res.status(200).json({ success: true, message: "product updated" })
    } catch (err) {
        return errorHandler(res)
    }
})
router.post("/set/highlight", async (req, res) => {

    const { token, id, highlight } = req.body
    if (!token || !id || !highlight) return errorHandler(res, 401, "not enough data")
    const newId = jwt.decode(token, process.env.SECRET_KEY)
    if (!newId.id) return errorHandler(res, 401, "error Handler")
    try {
        const user = await UserModel.findById(newId.id)
        if (!user) return errorHandler(res, 401, "not authorized")
        const product = await ProductModel.findOne({ _id: id, userId: user._id })
        if (!product) return errorHandler(res, 401, "not authorized")
        product.highlights.push(highlight);
        await product.save()
        return res.status(200).json({ success: true, message: "product updated" })
    } catch (err) {
        return errorHandler(res)
    }
})

const removeFolder = async (id) => {

    const rootPath = path.resolve(`./ public / ${id}`)
    fs.rmdirSync(rootPath, { recursive: true, force: true })

}

router.post("/upload/mainImage", upload.single("image"), async (req, res) => {
    const { token, id } = req.body
    if (!token || !id) {
        console.log(token, id)
        removeFolder(id)
        console.log("ID1")
        return errorHandler(res, 401, "not enough data")
    }
    try {
        const IdContainer = jwt.decode(token, process.env.SECRET_KEY)
        const user = await UserModel.findById(IdContainer.id)
        if (!user) {
            console.log("ID2")
            removeFolder(id)
            return errorHandler(res, 401, "not authorized")
        }
        const product = await ProductModel.findOne({ _id: id, userId: user._id })
        if (!product) {
            console.log("ID3")
            removeFolder(id)
            return errorHandler(res, 401, "not authorized")
        }
        if (product.mainImage.imageName) {
            let delPath = path.resolve(`./ public / ${id} / ${product.mainImage.imageName}`)
            console.log(delPath)
            fs.rmSync(delPath)
        }
        product.mainImage = {
            imageUrl: `${id} / ${req.file.filename}`,
            imageName: req.file.filename,
        }
        await product.save()
        return res.status(200).json({ succes: true, message: "image created successfully" })
    } catch (err) {
        removeFolder(id)
        console.log(err)
        return errorHandler(res)
    }
}
)

router.post("/upload/image2", upload.single("image"), async (req, res) => {
    const { token, id } = req.body
    console.log(token, id)
    if (!token || !id) {
        removeFolder(id)
        return errorHandler(res, 401, "not enough data")
    }
    try {
        const IdContainer = jwt.decode(token, process.env.SECRET_KEY)
        const user = await UserModel.findById(IdContainer.id)
        if (!user) {
            console.log("ID2")
            removeFolder(id)
            return errorHandler(res, 401, "not authorized")
        }
        const product = await ProductModel.findOne({ _id: id, userId: user._id })
        if (!product) {
            console.log("ID3")
            removeFolder(id)
            return errorHandler(res, 401, "not authorized")
        }
        if (product.images.image1.imageName) {
            let delPath = path.resolve(`./ public / ${id} / ${product.images.image1.imageName}`)
            console.log(delPath)
            fs.rmSync(delPath)
        }
        product.images.image1 = {
            imageUrl: `${id} / ${req.file.filename}`,
            imageName: req.file.filename,
        }
        await product.save()
        return res.status(200).json({ succes: true, message: "image created successfully" })
    } catch (err) {
        removeFolder(id)
        console.log(err)
        return errorHandler(res)
    }
})

router.post("/upload/image3", upload.single("image"), async (req, res) => {
    const { token, id } = req.body
    console.log(token, id)
    if (!token || !id) {
        removeFolder(id)
        return errorHandler(res, 401, "not enough data")
    }
    try {
        const IdContainer = jwt.decode(token, process.env.SECRET_KEY)
        const user = await UserModel.findById(IdContainer.id)
        if (!user) {
            console.log("ID2")
            removeFolder(id)
            return errorHandler(res, 401, "not authorized")
        }
        const product = await ProductModel.findOne({ _id: id, userId: user._id })
        if (!product) {
            console.log("ID3")
            removeFolder(id)
            return errorHandler(res, 401, "not authorized")
        }
        if (product.images.image2.imageName) {
            let delPath = path.resolve(`./ public / ${id} / ${product.images.image2.imageName}`)
            console.log(delPath)
            fs.rmSync(delPath)
        }
        product.images.image2 = {
            imageUrl: `${id} / ${req.file.filename}`,
            imageName: req.file.filename,
        }
        await product.save()
        return res.status(200).json({ succes: true, message: "image created successfully" })
    } catch (err) {
        removeFolder(id)
        console.log(err)
        return errorHandler(res)
    }
})

router.post("/upload/image4", upload.single("image"), async (req, res) => {
    const { token, id } = req.body
    console.log(token, id)
    if (!token || !id) {
        removeFolder(id)
        return errorHandler(res, 401, "not enough data")
    }
    try {
        const IdContainer = jwt.decode(token, process.env.SECRET_KEY)
        const user = await UserModel.findById(IdContainer.id)
        if (!user) {
            console.log("ID2")
            removeFolder(id)
            return errorHandler(res, 401, "not authorized")
        }
        const product = await ProductModel.findOne({ _id: id, userId: user._id })
        if (!product) {
            console.log("ID3")
            removeFolder(id)
            return errorHandler(res, 401, "not authorized")
        }
        if (product.images.image3.imageName) {
            let delPath = path.resolve(`./ public / ${id} / ${product.images.image3.imageName}`)
            console.log(delPath)
            fs.rmSync(delPath)
        }
        product.images.image3 = {
            imageUrl: `${id} / ${req.file.filename}`,
            imageName: req.file.filename,
        }
        await product.save()
        return res.status(200).json({ succes: true, message: "image created successfully" })
    } catch (err) {
        removeFolder(id)
        console.log(err)
        return errorHandler(res)
    }
})

router.post("/upload/image5", upload.single("image"), async (req, res) => {
    const { token, id } = req.body
    console.log(token, id)
    if (!token || !id) {
        removeFolder(id)
        return errorHandler(res, 401, "not enough data")
    }
    try {
        const IdContainer = jwt.decode(token, process.env.SECRET_KEY)
        const user = await UserModel.findById(IdContainer.id)
        if (!user) {
            console.log("ID2")
            removeFolder(id)
            return errorHandler(res, 401, "not authorized")
        }
        const product = await ProductModel.findOne({ _id: id, userId: user._id })
        if (!product) {
            console.log("ID3")
            removeFolder(id)
            return errorHandler(res, 401, "not authorized")
        }
        if (product.images.image4.imageName) {
            let delPath = path.resolve(`./ public / ${id} / ${product.images.image4.imageName}`)
            console.log(delPath)
            fs.rmSync(delPath)
        }
        product.images.image4 = {
            imageUrl: `${id} / ${req.file.filename}`,
            imageName: req.file.filename,
        }
        await product.save()
        return res.status(200).json({ succes: true, message: "image created successfully" })
    } catch (err) {
        removeFolder(id)
        console.log(err)
        return errorHandler(res)
    }
})

const removeFeature = (id) => {
    const featureDir = path.resolve(`./public/${id}/features`)
    fs.rmdirSync(featureDir, { force: true, recursive: true })
}

router.post("/upload/features", featuresUpload.single("image"), async (req, res) => {
    const { token, id, title, content } = req.body;
    if (!token || !id || !title || !content) {
        removeFeature(id)
        return errorHandler(res, 401, "not enough data")
    }
    try {
        const newId = jwt.decode(token, process.env.SECRET_KEY)
        if (!newId) {
            removeFeature(id)
            return errorHandler(res, 401, "user not found")
        }
        const user = await UserModel.findById(newId.id)
        if (!user) {
            removeFeature(id)
            return errorHandler(res, 401, "not authorized")
        }
        const product = await ProductModel.findOne({ _id: id, userId: user._id })
        if (!product) {
            removeFeature(id)
            return errorHandler(res, 401, "product not found")
        }
        product.features.push(
            {
                headline: title,
                description: content,
                image: {
                    imageUrl: `${id}/features/${req.file.filename}`,
                    imageName: req.file.filename
                }
            }
        )
        await product.save()
        return res.status(200).json({ success: true, message: "file updated" })
    } catch (err) {
        console.log(err)
        removeFeature(id)
        return errorHandler(res)
    }
})

router.get('/', async (req, res) => {
    const products = await ProductModel.find({ listed: true })
    return res.status(200).json({ success: true, message: "Listed Products", products })
})

router.get("/:id", async (req, res) => {

    try {

        const product = await ProductModel.findById(req.params.id)
        if (!product) return errorHandler(res, 404, "product not found")
        return res.status(200).json({ success: true, message: "product found", product })
    }
    catch (err) {
        return errorHandler(res)
    }

})

module.exports = router;