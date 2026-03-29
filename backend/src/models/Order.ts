import { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
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

const Order = models.Order || model('Order', OrderSchema);

export default Order;
