const mongoose = require("mongoose")

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        photo: {
            imageUrl: {
                type: String
            },
            imageName: {
                type: String,
            }
        },
        userType: {
            type: String,
            default: "user",
        },
        contactNumber: {
            type: String,
            required: true,
        },
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId
            }
        ],
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        cart: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                }
            }
        ],
        userRating: {
            type: Number,
            default: 5.0
        },
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        address: [
            {
                type: mongoose.Schema.Types.ObjectId,
            }
        ]
    }
)

module.exports = mongoose.model("User", schema);