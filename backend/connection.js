// imports
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const path = require("path")

// config
dotenv.config(
    {
        path: path.resolve("./.env")
    }
)

// export function
const connect = async () => {
    try {
        const connection = await mongoose.connect(process.env.CONNECTION_STRING)
        console.log("connected")
    } catch (err) {
        console.log(err)
    }
}

// export function 
module.exports = connect