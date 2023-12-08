const mongoose = require("mongoose")

const schema = new mongoose.Schema(
    {
        flatNo: {
            type: string,
            required: true,
        },
        society: {
            type: string,
            required: true,
        },
        street: {
            type: string,
            required: true,
        },
        city: {
            type: string,
            required: true,
        },
        state: {
            type: string,
            required: true,
        },
        pincode: {
            type: string,
            required: true,
        },
        landmark: {
            type: string,
            required: true,
        },
        tag: {
            type: string,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }
    }
)

module.exports = mongoose.model("Address", schema)