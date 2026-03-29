"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CartSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, unique: true },
    items: [{
            jewelleryId: String,
            name: String,
            imageUrl: String,
            price: Number,
            quantity: Number
        }],
    total: { type: Number, default: 0 }
}, { timestamps: true });
const Cart = mongoose_1.models.Cart || (0, mongoose_1.model)('Cart', CartSchema);
exports.default = Cart;
