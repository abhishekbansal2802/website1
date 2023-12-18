const mongoose = require("mongoose")

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
        },
        mainImage: {
            imageUrl: {
                type: String,
            },
            imageName: {
                type: String,
            }
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Seller",
            select: false,
        },
        rating: {
            type: Number,
            default: 0.0,
        },
        images: {
            image1: {
                imageUrl: {
                    type: String,
                },
                imageName: {
                    type: String,
                },
            },
            image2: {
                imageUrl: {
                    type: String,
                },
                imageName: {
                    type: String,
                }
            },
            image3: {
                imageUrl: {
                    type: String,
                },
                imageName: {
                    type: String,
                },
            },
            image4: {
                imageUrl: {
                    type: String,
                },
                imageName: {
                    type: String,
                }
            }
        },
        highlights: [
            {
                type: String,
            }
        ],
        category: {
            type: String,
            required: true,
        },
        features: [
            {
                image: {
                    imageUrl: {
                        type: String,
                        required: true,
                    },
                    imageName: {
                        type: String,
                        required: true,
                    }
                },
                headline: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                    required: true,
                }
            }
        ],
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
            select: false,
        },
        listed: {
            type: Boolean,
            default: false,
        }
    }
)

module.exports = mongoose.model("Products", schema)