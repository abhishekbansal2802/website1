const mongoose = require("mongoose")

const schema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        listedProducts: [
            {
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        delistedProducts: [
            {
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        sellerRating: {
            type: Number,
            default: 5.0,
        },
        verified: {
            type: Boolean,
            default: false,
        }
    }
)

module.exports = mongoose.model("Seller", schema)