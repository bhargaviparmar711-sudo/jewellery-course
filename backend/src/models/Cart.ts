import { Schema, model, models } from 'mongoose';

interface ICartItem {
  jewelleryId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

interface ICart {
  userId: string;
  items: ICartItem[];
  total: number;
}

const CartSchema = new Schema<ICart>({
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

const Cart = models.Cart || model('Cart', CartSchema);

export default Cart;

