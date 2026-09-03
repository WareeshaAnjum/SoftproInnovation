const mongoose=require("mongoose");

const productSchema =new  mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    short_description: {
        type: String,
        default: "",
        trim: true
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    cost_price: {
        type: Number
    },
    original_price: {
        type: Number
    },
    stock_quantity: {
        type: Number,
        default: 0
    },
    stock_status: {
        type: String,
        enum: ["in_stock", "out_of_stock", "low_stock"],
        default: "in_stock"
    },
    refund_policy: {
        type: String
    },
    is_cod_available: {
        type: Boolean,
        default: false
    },
    is_refundable_replacable: {
        type: Boolean,
        default: false
    },
    is_free_delivery: {
        type: Boolean,
        default: false
    },
    refund_days: {
        type: Number,
        default: 0
    },
    is_replacable: {
        type: Boolean,
        default: false
    },
    images:{
        type: [String],
        default: []
    },
    thumbnail: {
        type: String
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    height: {
        type: Number
    },
    width: {
        type: Number
    },
    is_featured: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);