"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const database_js_1 = __importDefault(require("./config/database.js"));
const Jewellery_js_1 = __importDefault(require("./models/Jewellery.js"));
const User_js_1 = __importDefault(require("./models/User.js"));
const Order_js_1 = __importDefault(require("./models/Order.js"));
const Cart_js_1 = __importDefault(require("./models/Cart.js"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: ["http://localhost:4200", "http://localhost:3000", "http://localhost:60500"]
}));
// Serve static assets
app.use('/assets', express_1.default.static(path_1.default.join(__dirname, '../../frontend/src/assets')));
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_js_1.default)();
            // API Routes
            // Health check
            app.get("/api/health", (_req, res) => {
                res.json({ status: "OK", message: "Backend is running with MongoDB" });
            });
            // Jewellery APIs
            app.get("/api/jewellery", (_req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const jewellery = yield Jewellery_js_1.default.find({});
                    res.json(jewellery);
                }
                catch (error) {
                    res.status(500).json({ error: "Failed to fetch jewellery" });
                }
            }));
            app.get("/api/jewellery/tags", (_req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const jewellery = yield Jewellery_js_1.default.find({});
                    const tags = jewellery.flatMap(j => j.tags || []);
                    const uniqueTags = [...new Set(tags)];
                    res.json(uniqueTags.map(tag => ({ name: tag, count: tags.filter(t => t === tag).length })));
                }
                catch (error) {
                    res.status(500).json({ error: "Failed to fetch tags" });
                }
            }));
            app.get("/api/jewellery/search", (req, res) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                try {
                    const searchTerm = ((_a = req.query.q) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
                    const jewellery = yield Jewellery_js_1.default.find({
                        name: { $regex: searchTerm, $options: 'i' }
                    });
                    res.json(jewellery);
                }
                catch (error) {
                    res.status(500).json({ error: "Search failed" });
                }
            }));
            app.get("/api/jewellery/tag/:tag", (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const tag = req.params.tag;
                    let query = {};
                    if (tag !== "All") {
                        query = { tags: tag };
                    }
                    const jewellery = yield Jewellery_js_1.default.find(query);
                    res.json(jewellery);
                }
                catch (error) {
                    res.status(500).json({ error: "Tag filter failed" });
                }
            }));
            app.get("/api/jewellery/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const id = req.params.id;
                    const jewellery = yield Jewellery_js_1.default.findOne({ id });
                    if (!jewellery) {
                        return res.status(404).json({ error: "Jewellery not found" });
                    }
                    res.json(jewellery);
                }
                catch (error) {
                    res.status(500).json({ error: "Failed to fetch jewellery" });
                }
            }));
            // User Auth APIs
            app.post("/api/auth/login", (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { email, password } = req.body;
                    const user = yield User_js_1.default.findOne({ email });
                    if (user && user.password === password) {
                        const _a = user.toObject(), { password: _ } = _a, userData = __rest(_a, ["password"]);
                        res.json({
                            success: true,
                            user: userData,
                            token: 'demo-jwt-' + Date.now() // simple demo token
                        });
                    }
                    else {
                        res.status(401).json({ success: false, message: 'Invalid credentials' });
                    }
                }
                catch (error) {
                    res.status(500).json({ success: false, message: "Login failed" });
                }
            }));
            app.post("/api/auth/register", (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { name, email, password } = req.body;
                    const existingUser = yield User_js_1.default.findOne({ email });
                    if (existingUser) {
                        return res.status(400).json({ success: false, message: 'User already exists' });
                    }
                    const user = yield User_js_1.default.create({ name, email, password, role: 'user' });
                    const _a = user.toObject(), { password: _ } = _a, userData = __rest(_a, ["password"]);
                    res.json({
                        success: true,
                        user: userData,
                        token: 'demo-jwt-' + Date.now()
                    });
                }
                catch (error) {
                    res.status(500).json({ success: false, message: "Registration failed" });
                }
            }));
            // Order APIs
            app.post("/api/orders", (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const orderData = req.body;
                    const order = yield Order_js_1.default.create(orderData);
                    res.status(201).json({ success: true, order });
                }
                catch (error) {
                    res.status(500).json({ error: "Failed to create order" });
                }
            }));
            app.get("/api/orders", (_req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const orders = yield Order_js_1.default.find({}).sort({ orderDate: -1 });
                    res.json(orders);
                }
                catch (error) {
                    res.status(500).json({ error: "Failed to fetch orders" });
                }
            }));
            app.get("/api/orders/:userId", (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { userId } = req.params;
                    const orders = yield Order_js_1.default.find({ userId }).sort({ orderDate: -1 });
                    res.json(orders);
                }
                catch (error) {
                    res.status(500).json({ error: "Failed to fetch user orders" });
                }
            }));
            // Cart APIs (per user)
            app.get("/api/cart/:userId", (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { userId } = req.params;
                    let cart = yield Cart_js_1.default.findOne({ userId });
                    if (!cart) {
                        cart = yield Cart_js_1.default.create({ userId, items: [], total: 0 });
                    }
                    res.json(cart);
                }
                catch (error) {
                    res.status(500).json({ error: "Failed to fetch cart" });
                }
            }));
            app.post("/api/cart/:userId/add", (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { userId } = req.params;
                    const { jewelleryId, quantity = 1 } = req.body;
                    const jewellery = yield Jewellery_js_1.default.findOne({ id: jewelleryId });
                    if (!jewellery) {
                        return res.status(404).json({ error: "Jewellery not found" });
                    }
                    let cart = yield Cart_js_1.default.findOne({ userId });
                    if (!cart) {
                        cart = yield Cart_js_1.default.create({ userId, items: [], total: 0 });
                    }
                    const existingItemIndex = cart.items.findIndex(item => item.jewelleryId === jewelleryId);
                    if (existingItemIndex > -1) {
                        cart.items[existingItemIndex].quantity += quantity;
                    }
                    else {
                        cart.items.push({
                            jewelleryId: jewellery.id,
                            name: jewellery.name,
                            imageUrl: jewellery.imageUrl,
                            price: jewellery.price,
                            quantity
                        });
                    }
                    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    yield cart.save();
                    res.json({ success: true, cart });
                }
                catch (error) {
                    res.status(500).json({ error: "Failed to add to cart" });
                }
            }));
            app.put("/api/cart/:userId/update", (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { userId } = req.params;
                    const { jewelleryId, quantity } = req.body;
                    const cart = yield Cart_js_1.default.findOne({ userId });
                    if (!cart)
                        return res.status(404).json({ error: "Cart not found" });
                    const itemIndex = cart.items.findIndex(item => item.jewelleryId === jewelleryId);
                    if (itemIndex === -1)
                        return res.status(404).json({ error: "Item not found" });
                    cart.items[itemIndex].quantity = quantity;
                    if (quantity === 0) {
                        cart.items.splice(itemIndex, 1);
                    }
                    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    yield cart.save();
                    res.json({ success: true, cart });
                }
                catch (error) {
                    res.status(500).json({ error: "Failed to update cart" });
                }
            }));
            app.delete("/api/cart/:userId/remove/:jewelleryId", (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { userId, jewelleryId } = req.params;
                    const cart = yield Cart_js_1.default.findOne({ userId });
                    if (!cart)
                        return res.status(404).json({ error: "Cart not found" });
                    cart.items = cart.items.filter(item => item.jewelleryId !== jewelleryId);
                    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    yield cart.save();
                    res.json({ success: true, cart });
                }
                catch (error) {
                    res.status(500).json({ error: "Failed to remove from cart" });
                }
            }));
            app.delete("/api/cart/:userId/clear", (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { userId } = req.params;
                    yield Cart_js_1.default.findOneAndUpdate({ userId }, { items: [], total: 0 });
                    res.json({ success: true, message: "Cart cleared" });
                }
                catch (error) {
                    res.status(500).json({ error: "Failed to clear cart" });
                }
            }));
            // SPA fallback
            app.use(express_1.default.static(path_1.default.join(__dirname, '../../frontend/dist/frontend')));
            app.get('*', (req, res) => {
                res.sendFile(path_1.default.join(__dirname, '../../frontend/dist/frontend/index.html'));
            });
            // Error handler
            app.use((err, _req, res, _next) => {
                console.error(err.stack);
                res.status(500).json({ error: 'Something went wrong!' });
            });
            // Start server
            app.listen(PORT, () => {
                console.log(`🚀 Server running on http://localhost:${PORT}`);
            });
        }
        catch (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    });
}
startServer();
