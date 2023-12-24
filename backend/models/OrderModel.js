const mongoose = require("mongoose")

const schema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                },
                sellerId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    MRP: {
                        type: Number,
                        required: true,
                    },
                    delivery: {
                        type: Number,
                        required: true,
                    },
                    subtotal: {
                        type: Number,
                        required: true,
                    }
                },
                orderStatus: {
                    type: String,
                    required: true,
                }
            }
        ],
        address: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        modeOfPayment: {
            type: String,
            requried: true,
        },
        contactNumber: {
            type: String,
            required: true,
        },
    
    }
)

module.exports = mongoose.model("Order", schema)