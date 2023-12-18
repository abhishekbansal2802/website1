// imports
const express = require("express")
const dotenv = require("dotenv")
const path = require("path")
const bodyParser = require("body-parser")
const cors = require("cors")
const connect = require("./connection")
const userRouter = require("./routes/UserRoutes")
const sellerRouter = require("./routes/SellerRoutes")
const addressRouter = require("./routes/AddressRoutes")
const productRouter = require("./routes/ProductRoutes")
const analyticsRouter = require("./routes/AnalyticsRoutes")

// initializations 
const app = express()
dotenv.config({
    path: path.resolve("./.env")
})
connect()

// middlewares
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

// methods
app.use("/api/user", userRouter)
app.use("/api/address", addressRouter)
app.use('/api/seller', sellerRouter)
app.use("/api/product", productRouter)
app.use("/api/analytics", analyticsRouter)

// listen server
const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`working on http://localhost:${port}`)
})