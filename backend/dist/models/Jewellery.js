"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const JewellerySchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    tags: [{ type: String }],
    description: String
}, { timestamps: true });
const Jewellery = mongoose_1.models.Jewellery || (0, mongoose_1.model)('Jewellery', JewellerySchema);
exports.default = Jewellery;
