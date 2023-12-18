const express = require("express")
const AnalyticsModel = require("../models/AnalyticsModel")
const ProductModel = require("../models/ProductModel")

const router = express.Router()


router.get("/trending", async (req, res) => {
    const date = new Date().toLocaleDateString("en-GB")
    const analytics = await AnalyticsModel.find({ todayDate: date }).sort({ todayViews: -1, purchaseCount: -1, category: 1 }).limit(10)
    let ids = analytics.map((e) => e.id)
    if (ids.length < 10) {
        const newAnalytics = await AnalyticsModel.find({ id: { $nin: ids } }).sort({ purchaseCount: -1, category: 1 }).limit(10 - ids.length)
        const newIds = newAnalytics.map((e) => e.id)
        ids = [...ids, ...newIds];
    }
    const products = await ProductModel.find({ _id: ids })
    return res.status(200).json({ success: true, message: "trending products found", products })
})

router.get("/mobile", async (req, res) => {
    const date = new Date().toLocaleDateString("en-GB")
    const analytics = await AnalyticsModel.find({ todayDate: date, category: "Mobile" }).sort({ todayViews: -1, purchaseCount: -1 }).limit(10)
    let ids = analytics.map((e) => e.id)
    if (ids.length < 10) {
        const newAnalytics = await AnalyticsModel.find({ id: { $nin: ids }, category: "Mobile" }).sort({ purchaseCount: -1, category: 1 }).limit(10 - ids.length)
        const newIds = newAnalytics.map((e) => e.id)
        ids = [...ids, ...newIds];
    }
    const products = await ProductModel.find({ _id: ids })
    return res.status(200).json({ success: true, message: "mobile products found", products })
})

router.get("/furniture", async (req, res) => {
    const date = new Date().toLocaleDateString("en-GB")
    const analytics = await AnalyticsModel.find({ todayDate: date, category: "Furniture" }).sort({ todayViews: -1, purchaseCount: -1 }).limit(10)
    let ids = analytics.map((e) => e.id)
    if (ids.length < 10) {
        const newAnalytics = await AnalyticsModel.find({ id: { $nin: ids }, category: "Furniture" }).sort({ purchaseCount: -1, category: 1 }).limit(10 - ids.length)
        const newIds = newAnalytics.map((e) => e.id)
        ids = [...ids, ...newIds];
    }
    const products = await ProductModel.find({ _id: ids })
    return res.status(200).json({ success: true, message: "mobile products found", products })
})

router.get("/appliance", async (req, res) => {
    const date = new Date().toLocaleDateString("en-GB")
    const analytics = await AnalyticsModel.find({ todayDate: date, category: "Appliance" }).sort({ todayViews: -1, purchaseCount: -1 }).limit(10)
    let ids = analytics.map((e) => e.id)
    if (ids.length < 10) {
        const newAnalytics = await AnalyticsModel.find({ id: { $nin: ids }, category: "Appliance" }).sort({ purchaseCount: -1, category: 1 }).limit(10 - ids.length)
        const newIds = newAnalytics.map((e) => e.id)
        ids = [...ids, ...newIds];
    }
    const products = await ProductModel.find({ _id: ids })
    return res.status(200).json({ success: true, message: "mobile products found", products })
})

module.exports = router