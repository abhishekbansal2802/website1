const mongoose = require("mongoose")

const schema = new mongoose.Schema(
    {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        todayViews: {
            type: Number,
            default: 0,
        },
        todayDate: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        purchaseCount: {
            type: String,
            default: 0
        },
    }
)

module.exports = mongoose.model("Analytics", schema)