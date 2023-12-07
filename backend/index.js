// imports
const express = require("express")
const dotenv = require("dotenv")
const path = require("path")
const bodyParser = require("body-parser")
const cors = require("cors")
const connect = require("./connection")
const userRouter = require("./routes/UserRoutes")

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

// methods
app.use("/api/user", userRouter)

// listen server
const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`working on http://localhost:${port}`)
})