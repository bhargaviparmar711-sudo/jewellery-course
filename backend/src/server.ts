import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/database.js";
import Jewellery from "./models/Jewellery.js";
import User from "./models/User.js";
import Order from "./models/Order.js";
import Cart from "./models/Cart.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:4200", "http://localhost:3000", "http://localhost:60500"]
}));

// Serve static assets
app.use('/assets', express.static(path.join(__dirname, '../../frontend/src/assets')));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
async function startServer() {
  try {
    await connectDB();
    
    // API Routes
    // Health check
    app.get("/api/health", (_req: Request, res: Response) => {
        res.json({ status: "OK", message: "Backend is running with MongoDB" });
    });

    // Jewellery APIs
    app.get("/api/jewellery", async (_req: Request, res: Response) => {
        try {
            const jewellery = await Jewellery.find({});
            res.json(jewellery);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch jewellery" });
        }
    });

    app.get("/api/jewellery/tags", async (_req: Request, res: Response) => {
        try {
            const jewellery = await Jewellery.find({});
            const tags = jewellery.flatMap(j => j.tags || []);
            const uniqueTags = [...new Set(tags)];
            res.json(uniqueTags.map(tag => ({ name: tag, count: tags.filter(t => t === tag).length })));
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch tags" });
        }
    });

    app.get("/api/jewellery/search", async (req: Request, res: Response) => {
        try {
            const searchTerm = (req.query.q as string)?.toLowerCase() || '';
            const jewellery = await Jewellery.find({
                name: { $regex: searchTerm, $options: 'i' }
            });
            res.json(jewellery);
        } catch (error) {
            res.status(500).json({ error: "Search failed" });
        }
    });

    app.get("/api/jewellery/tag/:tag", async (req: Request, res: Response) => {
        try {
            const tag = req.params.tag as string;
            let query = {};
            if (tag !== "All") {
                query = { tags: tag };
            }
            const jewellery = await Jewellery.find(query);
            res.json(jewellery);
        } catch (error) {
            res.status(500).json({ error: "Tag filter failed" });
        }
    });

    app.get("/api/jewellery/:id", async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const jewellery = await Jewellery.findOne({ id });
            if (!jewellery) {
                return res.status(404).json({ error: "Jewellery not found" });
            }
            res.json(jewellery);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch jewellery" });
        }
    });

    // User Auth APIs
    app.post("/api/auth/login", async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (user && user.password === password) {
                const { password: _, ...userData } = user.toObject();
                res.json({
                    success: true,
                    user: userData,
                    token: 'demo-jwt-' + Date.now() // simple demo token
                });
            } else {
                res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Login failed" });
        }
    });

    app.post("/api/auth/register", async (req: Request, res: Response) => {
        try {
            const { name, email, password } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'User already exists' });
            }
            const user = await User.create({ name, email, password, role: 'user' });
            const { password: _, ...userData } = user.toObject();
            res.json({
                success: true,
                user: userData,
                token: 'demo-jwt-' + Date.now()
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Registration failed" });
        }
    });

    // Order APIs
    app.post("/api/orders", async (req: Request, res: Response) => {
        try {
            const orderData = req.body;
            const order = await Order.create(orderData);
            res.status(201).json({ success: true, order });
        } catch (error) {
            res.status(500).json({ error: "Failed to create order" });
        }
    });

    app.get("/api/orders", async (_req: Request, res: Response) => {
        try {
            const orders = await Order.find({}).sort({ orderDate: -1 });
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch orders" });
        }
    });

    app.get("/api/orders/:userId", async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const orders = await Order.find({ userId }).sort({ orderDate: -1 });
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch user orders" });
        }
    });

    // Cart APIs (per user)
    app.get("/api/cart/:userId", async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            let cart = await Cart.findOne({ userId });
            if (!cart) {
                cart = await Cart.create({ userId, items: [], total: 0 });
            }
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch cart" });
        }
    });

    app.post("/api/cart/:userId/add", async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const { jewelleryId, quantity = 1 } = req.body;
            
            const jewellery = await Jewellery.findOne({ id: jewelleryId });
            if (!jewellery) {
                return res.status(404).json({ error: "Jewellery not found" });
            }

            let cart = await Cart.findOne({ userId });
            if (!cart) {
                cart = await Cart.create({ userId, items: [], total: 0 });
            }

            const existingItemIndex = cart.items.findIndex(item => item.jewelleryId === jewelleryId);
            if (existingItemIndex > -1) {
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                cart.items.push({
                    jewelleryId: jewellery.id,
                    name: jewellery.name,
                    imageUrl: jewellery.imageUrl,
                    price: jewellery.price,
                    quantity
                });
            }

            cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            await cart.save();

            res.json({ success: true, cart });
        } catch (error) {
            res.status(500).json({ error: "Failed to add to cart" });
        }
    });

    app.put("/api/cart/:userId/update", async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const { jewelleryId, quantity } = req.body;

            const cart = await Cart.findOne({ userId });
            if (!cart) return res.status(404).json({ error: "Cart not found" });

            const itemIndex = cart.items.findIndex(item => item.jewelleryId === jewelleryId);
            if (itemIndex === -1) return res.status(404).json({ error: "Item not found" });

            cart.items[itemIndex].quantity = quantity;
            if (quantity === 0) {
                cart.items.splice(itemIndex, 1);
            }

            cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            await cart.save();

            res.json({ success: true, cart });
        } catch (error) {
            res.status(500).json({ error: "Failed to update cart" });
        }
    });

    app.delete("/api/cart/:userId/remove/:jewelleryId", async (req: Request, res: Response) => {
        try {
            const { userId, jewelleryId } = req.params;
            const cart = await Cart.findOne({ userId });
            if (!cart) return res.status(404).json({ error: "Cart not found" });

            cart.items = cart.items.filter(item => item.jewelleryId !== jewelleryId);
            cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            await cart.save();

            res.json({ success: true, cart });
        } catch (error) {
            res.status(500).json({ error: "Failed to remove from cart" });
        }
    });

    app.delete("/api/cart/:userId/clear", async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            await Cart.findOneAndUpdate({ userId }, { items: [], total: 0 });
            res.json({ success: true, message: "Cart cleared" });
        } catch (error) {
            res.status(500).json({ error: "Failed to clear cart" });
        }
    });

    // SPA fallback
    app.use(express.static(path.join(__dirname, '../../frontend/dist/frontend')));
    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, '../../frontend/dist/frontend/index.html'));
    });

    // Error handler
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.error(err.stack);
        res.status(500).json({ error: 'Something went wrong!' });
    });

    // Start server
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

