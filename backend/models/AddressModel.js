const mongoose = require("mongoose")

const schema = new mongoose.Schema(
    {
        flatNo: {
            type: String,
            required: true,
        },
        society: {
            type: String,
            required: true,
        },
        street: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
        landmark: {
            type: String,
            required: true,
        },
        tag: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
            select: false
        }
    }
)

module.exports = mongoose.model("Address", schema)