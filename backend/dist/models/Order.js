"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    items: [{
            jewelleryId: String,
            name: String,
            imageUrl: String,
            price: Number,
            quantity: Number
        }],
    total: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    orderDate: { type: Date, default: Date.now }
}, { timestamps: true });
const Order = mongoose_1.models.Order || (0, mongoose_1.model)('Order', OrderSchema);
exports.default = Order;
